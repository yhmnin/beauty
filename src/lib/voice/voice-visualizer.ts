import { lerp, mapRange, clamp } from "@/lib/utils";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  angle: number;
  speed: number;
  orbitRadius: number;
  hue: number;
  alpha: number;
}

export class VoiceVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationFrame: number | null = null;
  private audioLevel = 0;
  private targetAudioLevel = 0;
  private isSpeaking = false;
  private isListening = false;
  private time = 0;
  private baseHue = 30;
  private dpr: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.dpr = window.devicePixelRatio || 1;
    this.resize();
    this.initParticles();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * this.dpr;
    this.canvas.height = rect.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  private initParticles() {
    const count = 120;
    this.particles = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const orbitRadius = 40 + Math.random() * 80;

      this.particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: 1 + Math.random() * 2,
        baseRadius: 1 + Math.random() * 2,
        angle,
        speed: 0.002 + Math.random() * 0.008,
        orbitRadius,
        hue: this.baseHue + Math.random() * 20 - 10,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }
  }

  setAudioLevel(level: number) {
    this.targetAudioLevel = level;
  }

  setSpeaking(speaking: boolean) {
    this.isSpeaking = speaking;
  }

  setListening(listening: boolean) {
    this.isListening = listening;
  }

  start() {
    if (this.animationFrame) return;
    this.animate();
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private animate = () => {
    this.time += 0.016;
    this.audioLevel = lerp(this.audioLevel, this.targetAudioLevel, 0.12);

    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;

    this.ctx.clearRect(0, 0, w, h);

    this.drawCoreGlow(cx, cy);
    this.drawParticles(cx, cy);
    this.drawWaveRing(cx, cy);

    this.animationFrame = requestAnimationFrame(this.animate);
  };

  private drawCoreGlow(cx: number, cy: number) {
    const intensity = 0.15 + this.audioLevel * 0.5;
    const coreRadius = 30 + this.audioLevel * 40;
    const breathe = Math.sin(this.time * 1.5) * 5;

    const gradient = this.ctx.createRadialGradient(
      cx,
      cy,
      0,
      cx,
      cy,
      coreRadius + breathe + 60
    );
    gradient.addColorStop(0, `hsla(${this.baseHue}, 60%, 75%, ${intensity})`);
    gradient.addColorStop(0.4, `hsla(${this.baseHue}, 50%, 50%, ${intensity * 0.5})`);
    gradient.addColorStop(1, `hsla(${this.baseHue}, 40%, 30%, 0)`);

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, coreRadius + breathe + 60, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    const innerGradient = this.ctx.createRadialGradient(
      cx,
      cy,
      0,
      cx,
      cy,
      coreRadius + breathe
    );
    innerGradient.addColorStop(0, `hsla(${this.baseHue}, 40%, 90%, ${intensity * 1.2})`);
    innerGradient.addColorStop(0.6, `hsla(${this.baseHue}, 50%, 60%, ${intensity * 0.6})`);
    innerGradient.addColorStop(1, `hsla(${this.baseHue}, 40%, 40%, 0)`);

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, coreRadius + breathe, 0, Math.PI * 2);
    this.ctx.fillStyle = innerGradient;
    this.ctx.fill();
  }

  private drawParticles(cx: number, cy: number) {
    const audioExpand = 1 + this.audioLevel * 2;

    for (const p of this.particles) {
      p.angle += p.speed * (1 + this.audioLevel * 3);

      const wobble = this.isSpeaking
        ? Math.sin(this.time * 4 + p.angle * 3) * 15 * this.audioLevel
        : Math.sin(this.time * 2 + p.angle * 2) * 3;

      const radius = p.orbitRadius * audioExpand + wobble;

      p.x = cx + Math.cos(p.angle) * radius;
      p.y = cy + Math.sin(p.angle) * radius;

      const displayRadius = p.baseRadius * (1 + this.audioLevel * 1.5);
      const alpha = p.alpha * (0.5 + this.audioLevel * 0.5);

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, displayRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue}, 50%, 75%, ${alpha})`;
      this.ctx.fill();

      if (this.audioLevel > 0.1) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, displayRadius * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 50%, 75%, ${alpha * 0.15})`;
        this.ctx.fill();
      }
    }
  }

  private drawWaveRing(cx: number, cy: number) {
    if (this.audioLevel < 0.02 && !this.isSpeaking) return;

    const ringRadius = 100 + this.audioLevel * 60;
    const segments = 128;
    const waveAmplitude = mapRange(
      clamp(this.audioLevel, 0, 1),
      0,
      1,
      2,
      25
    );

    this.ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const wave =
        Math.sin(angle * 6 + this.time * 3) * waveAmplitude +
        Math.sin(angle * 10 + this.time * 5) * waveAmplitude * 0.5;

      const r = ringRadius + wave;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.closePath();
    this.ctx.strokeStyle = `hsla(${this.baseHue}, 40%, 70%, ${0.15 + this.audioLevel * 0.3})`;
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();
  }
}
