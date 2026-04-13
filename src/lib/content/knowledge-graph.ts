import { PEOPLE, WORKS, MOVEMENTS, EVENTS } from "./aesthetic-db";

export interface GraphNode {
  id: string;
  type: "person" | "work" | "movement" | "event";
  label: string;
  connections: GraphEdge[];
}

export interface GraphEdge {
  targetId: string;
  targetType: string;
  relationship: string;
}

export function buildKnowledgeGraph(): Map<string, GraphNode> {
  const graph = new Map<string, GraphNode>();

  for (const person of PEOPLE) {
    const node: GraphNode = {
      id: person.id,
      type: "person",
      label: person.name,
      connections: [],
    };

    for (const work of WORKS) {
      if (work.creator === person.name) {
        node.connections.push({
          targetId: work.id,
          targetType: "work",
          relationship: "created",
        });
      }
    }

    for (const movement of MOVEMENTS) {
      if (movement.keyFigures.some((f) => person.name.includes(f.split(" ").pop()!))) {
        node.connections.push({
          targetId: movement.id,
          targetType: "movement",
          relationship: "associated_with",
        });
      }
    }

    graph.set(person.id, node);
  }

  for (const work of WORKS) {
    const node: GraphNode = {
      id: work.id,
      type: "work",
      label: work.title,
      connections: [],
    };

    const creator = PEOPLE.find((p) => p.name === work.creator);
    if (creator) {
      node.connections.push({
        targetId: creator.id,
        targetType: "person",
        relationship: "created_by",
      });
    }

    if (work.movement) {
      const movement = MOVEMENTS.find((m) => m.name === work.movement);
      if (movement) {
        node.connections.push({
          targetId: movement.id,
          targetType: "movement",
          relationship: "belongs_to",
        });
      }
    }

    graph.set(work.id, node);
  }

  for (const movement of MOVEMENTS) {
    const node: GraphNode = {
      id: movement.id,
      type: "movement",
      label: movement.name,
      connections: [],
    };

    for (const figure of movement.keyFigures) {
      const person = PEOPLE.find((p) => p.name.includes(figure.split(" ").pop()!));
      if (person) {
        node.connections.push({
          targetId: person.id,
          targetType: "person",
          relationship: "features",
        });
      }
    }

    graph.set(movement.id, node);
  }

  for (const event of EVENTS) {
    graph.set(event.id, {
      id: event.id,
      type: "event",
      label: event.name,
      connections: [],
    });
  }

  return graph;
}

export function getRelatedContent(
  id: string,
  graph: Map<string, GraphNode>,
  depth: number = 1
): string[] {
  const visited = new Set<string>();
  const result: string[] = [];

  function traverse(nodeId: string, currentDepth: number) {
    if (currentDepth > depth || visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = graph.get(nodeId);
    if (!node) return;

    for (const edge of node.connections) {
      if (!visited.has(edge.targetId)) {
        result.push(edge.targetId);
        traverse(edge.targetId, currentDepth + 1);
      }
    }
  }

  traverse(id, 0);
  return result;
}
