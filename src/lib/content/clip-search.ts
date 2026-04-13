import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateTextEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    dimensions: 512,
  });

  return response.data[0].embedding;
}

export async function generateBatchEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
    dimensions: 512,
  });

  return response.data
    .sort((a, b) => a.index - b.index)
    .map((d) => d.embedding);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export interface VectorSearchResult {
  id: string;
  score: number;
}

export async function vectorSearch(
  query: string,
  embeddings: Map<string, number[]>,
  topK: number = 10
): Promise<VectorSearchResult[]> {
  const queryEmbedding = await generateTextEmbedding(query);

  const results: VectorSearchResult[] = [];

  for (const [id, embedding] of embeddings) {
    const score = cosineSimilarity(queryEmbedding, embedding);
    results.push({ id, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}

export async function hybridSearch(
  query: string,
  embeddings: Map<string, number[]>,
  textSearchFn: (query: string) => { id: string; score: number }[],
  weights: { vector: number; text: number } = { vector: 0.6, text: 0.4 },
  topK: number = 10
): Promise<VectorSearchResult[]> {
  const [vectorResults, textResults] = await Promise.all([
    vectorSearch(query, embeddings, topK * 2),
    Promise.resolve(textSearchFn(query)),
  ]);

  const scoreMap = new Map<string, number>();

  const maxVectorScore = vectorResults[0]?.score || 1;
  for (const r of vectorResults) {
    const normalized = r.score / maxVectorScore;
    scoreMap.set(r.id, (scoreMap.get(r.id) || 0) + normalized * weights.vector);
  }

  const maxTextScore = textResults[0]?.score || 1;
  for (const r of textResults) {
    const normalized = r.score / maxTextScore;
    scoreMap.set(r.id, (scoreMap.get(r.id) || 0) + normalized * weights.text);
  }

  return Array.from(scoreMap.entries())
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
