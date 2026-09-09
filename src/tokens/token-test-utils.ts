import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type TokenNode = { $value?: unknown; [key: string]: unknown };

export function readTokenDocument(file: string): TokenNode {
  return JSON.parse(readFileSync(resolve(file), "utf8")) as TokenNode;
}

export function getToken(document: TokenNode, path: string): TokenNode {
  let current: unknown = document;
  for (const segment of path.split(".")) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      throw new Error(`Token inexistente: ${path}`);
    }
    current = (current as TokenNode)[segment];
  }
  return current as TokenNode;
}

export function resolveToken(
  documents: TokenNode[],
  path: string,
  visited = new Set<string>(),
): unknown {
  if (visited.has(path)) throw new Error(`Ciclo de alias: ${[...visited, path].join(" -> ")}`);
  visited.add(path);
  const token = documents
    .map((document) => {
      try {
        return getToken(document, path);
      } catch {
        return undefined;
      }
    })
    .find(Boolean);
  if (!token || token.$value === undefined) throw new Error(`Token sem valor: ${path}`);
  if (typeof token.$value === "string") {
    const alias = token.$value.match(/^\{(.+)\}$/u)?.[1];
    if (alias) return resolveToken(documents, alias, visited);
  }
  return token.$value;
}

export function walkTokens(
  node: TokenNode,
  visit: (path: string, value: unknown) => void,
  prefix: string[] = [],
): void {
  if (node.$value !== undefined) visit(prefix.join("."), node.$value);
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$") || !value || typeof value !== "object") continue;
    walkTokens(value as TokenNode, visit, [...prefix, key]);
  }
}

function channel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function contrastRatio(first: string, second: string): number {
  const luminance = (hex: string) => {
    const channels = hex.match(/[a-f\d]{2}/giu)?.map((part) => Number.parseInt(part, 16));
    if (!channels || channels.length !== 3) throw new Error(`Cor hexadecimal inválida: ${hex}`);
    return (
      0.2126 * channel(channels[0]!) +
      0.7152 * channel(channels[1]!) +
      0.0722 * channel(channels[2]!)
    );
  };
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter! + 0.05) / (darker! + 0.05);
}
