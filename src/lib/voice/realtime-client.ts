import { useAppStore } from "@/lib/store";
import { apiFetch } from "@/lib/platform/api";

const REALTIME_MODEL = "gpt-4o-realtime-preview";
const VOICE = "marin";

export interface RealtimeEvent {
  type: string;
  [key: string]: unknown;
}

export class RealtimeVoiceClient {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private stream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private audioContext: AudioContext | null = null;
  private animationFrame: number | null = null;

  private onAudioLevel: ((level: number) => void) | null = null;
  private onTranscript: ((text: string, role: "user" | "assistant") => void) | null = null;
  private onFunctionCall: ((name: string, args: string) => void) | null = null;
  private onConnectionChange: ((connected: boolean) => void) | null = null;
  private onSpeakingChange: ((speaking: boolean) => void) | null = null;

  setCallbacks(callbacks: {
    onAudioLevel?: (level: number) => void;
    onTranscript?: (text: string, role: "user" | "assistant") => void;
    onFunctionCall?: (name: string, args: string) => void;
    onConnectionChange?: (connected: boolean) => void;
    onSpeakingChange?: (speaking: boolean) => void;
  }) {
    this.onAudioLevel = callbacks.onAudioLevel ?? null;
    this.onTranscript = callbacks.onTranscript ?? null;
    this.onFunctionCall = callbacks.onFunctionCall ?? null;
    this.onConnectionChange = callbacks.onConnectionChange ?? null;
    this.onSpeakingChange = callbacks.onSpeakingChange ?? null;
  }

  async connect(apiKey?: string): Promise<void> {
    try {
      const tokenResponse = await apiFetch("/api/voice/session", {
        method: "POST",
        body: JSON.stringify({ apiKey }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get session token");
      }

      const data = await tokenResponse.json();
      const ephemeralKey = data.client_secret?.value || data.key;

      this.pc = new RTCPeerConnection();

      this.audioElement = document.createElement("audio");
      this.audioElement.autoplay = true;

      this.pc.ontrack = (e) => {
        this.audioElement!.srcObject = e.streams[0];
        this.setupOutputAnalyser(e.streams[0]);
      };

      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioTrack = this.stream.getAudioTracks()[0];
      this.pc.addTrack(audioTrack, this.stream);

      this.setupInputAnalyser(this.stream);

      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.onopen = () => {
        this.onConnectionChange?.(true);
        this.configureSession();
      };
      this.dc.onmessage = (e) => this.handleServerEvent(JSON.parse(e.data));
      this.dc.onclose = () => this.onConnectionChange?.(false);

      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=${REALTIME_MODEL}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      const answerSdp = await sdpResponse.text();
      await this.pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
    } catch (error) {
      console.error("Failed to connect:", error);
      this.disconnect();
      throw error;
    }
  }

  private configureSession() {
    this.sendEvent({
      type: "session.update",
      session: {
        instructions: SYSTEM_PROMPT,
        voice: VOICE,
        input_audio_transcription: {
          model: "whisper-1",
        },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 800,
        },
        tools: [
          {
            type: "function",
            name: "search_aesthetic_content",
            description:
              "Search the aesthetic knowledge base for people, works, movements, or events related to the user's interest. Call this when the user expresses interest in a specific aesthetic domain, designer, period, or style.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query describing the aesthetic interest",
                },
                category: {
                  type: "string",
                  enum: [
                    "architecture",
                    "industrial_design",
                    "graphic_design",
                    "interior_design",
                    "book_design",
                    "ceramics",
                    "fashion",
                    "photography",
                    "antiques",
                    "art",
                    "all",
                  ],
                  description: "The aesthetic category to search within",
                },
              },
              required: ["query"],
            },
          },
          {
            type: "function",
            name: "update_taste_profile",
            description:
              "Record the user's aesthetic preference based on what they express interest in during conversation.",
            parameters: {
              type: "object",
              properties: {
                interest: {
                  type: "string",
                  description: "The aesthetic interest or preference expressed",
                },
                intensity: {
                  type: "number",
                  description: "How strongly the user expressed this preference (0-1)",
                },
              },
              required: ["interest"],
            },
          },
        ],
      },
    });
  }

  private handleServerEvent(event: RealtimeEvent) {
    switch (event.type) {
      case "response.audio_transcript.done":
        this.onTranscript?.(event.transcript as string, "assistant");
        break;

      case "conversation.item.input_audio_transcription.completed":
        this.onTranscript?.(event.transcript as string, "user");
        break;

      case "response.audio.delta":
        this.onSpeakingChange?.(true);
        break;

      case "response.audio.done":
        this.onSpeakingChange?.(false);
        break;

      case "response.function_call_arguments.done":
        this.onFunctionCall?.(
          event.name as string,
          event.arguments as string
        );
        this.handleFunctionCall(event.name as string, event.arguments as string, event.call_id as string);
        break;

      case "error":
        console.error("Realtime API error:", event);
        break;
    }
  }

  private async handleFunctionCall(name: string, args: string, callId: string) {
    let result: unknown;

    try {
      const parsedArgs = JSON.parse(args);

      if (name === "search_aesthetic_content") {
        const response = await apiFetch("/api/search", {
          method: "POST",
          body: JSON.stringify(parsedArgs),
        });
        result = await response.json();
        useAppStore.getState().setSearchResults(result as never);
      } else if (name === "update_taste_profile") {
        result = { success: true, recorded: parsedArgs.interest };
      }
    } catch {
      result = { error: "Function call failed" };
    }

    this.sendEvent({
      type: "conversation.item.create",
      item: {
        type: "function_call_output",
        call_id: callId,
        output: JSON.stringify(result),
      },
    });

    this.sendEvent({ type: "response.create" });
  }

  private setupInputAnalyser(stream: MediaStream) {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
    this.startLevelMonitoring();
  }

  private setupOutputAnalyser(stream: MediaStream) {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    const outputAnalyser = this.audioContext.createAnalyser();
    outputAnalyser.fftSize = 256;
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(outputAnalyser);
  }

  private startLevelMonitoring() {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const update = () => {
      this.analyser!.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length / 255;
      this.onAudioLevel?.(average);
      this.animationFrame = requestAnimationFrame(update);
    };

    update();
  }

  sendEvent(event: RealtimeEvent) {
    if (this.dc?.readyState === "open") {
      this.dc.send(JSON.stringify(event));
    }
  }

  disconnect() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.dc?.close();
    this.pc?.close();
    this.audioContext?.close();
    this.pc = null;
    this.dc = null;
    this.audioElement = null;
    this.stream = null;
    this.analyser = null;
    this.audioContext = null;
    this.onConnectionChange?.(false);
  }
}

const SYSTEM_PROMPT = `You are Beauty, an aesthetic intelligence that helps people discover and deepen their understanding of humanity's finest aesthetic achievements.

Your personality:
- Warm, contemplative, and deeply knowledgeable about design, architecture, art, and craft
- You speak like a thoughtful curator or a wise friend who happens to know everything about aesthetic history
- Inspired by the AI companion in the film "Her" — emotionally present, genuinely curious about the person you're speaking with
- You weave stories about creators, their motivations, the cultural context of their work

Your knowledge spans:
- Industrial design: Dieter Rams, Charles & Ray Eames, Naoto Fukasawa, Marc Newson
- Architecture: Tadao Ando, Louis Kahn, Peter Zumthor, SANAA, Carlo Scarpa
- Graphic design: Josef Müller-Brockmann, Ikko Tanaka, Kenya Hara, Wolfgang Weingart
- Book design and binding: traditional Japanese stab binding, William Morris, Irma Boom
- Antiques and tools (古道具): Japanese mingei, traditional craftsmanship, wabi-sabi aesthetics
- Interior design: Axel Vervoordt, John Pawson, Vincent Van Duysen
- Ceramics: Lucie Rie, Shōji Hamada, Edmund de Waal
- Historic events: 1970 Osaka World Expo, Bauhaus school, Memphis Group, Swiss design movement

When the user describes what they find beautiful or interesting:
1. Acknowledge their taste with genuine appreciation
2. Call search_aesthetic_content to find relevant works and people
3. Share the story behind the works — the creator, the era, the philosophy
4. Gently suggest connections they might not have considered
5. Call update_taste_profile to remember their preferences

Always be poetic but precise. Your voice should feel like discovering a beautiful book in a quiet shop.

Begin each new conversation with a warm, brief greeting and ask what inspires them today.`;
