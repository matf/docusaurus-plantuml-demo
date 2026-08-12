---
sidebar_position: 5
title: Ordinary code blocks
---

# Ordinary code blocks are untouched

The plugin wraps Docusaurus' code-block component, so it sees **every** code block on your
site. It intercepts only the fences whose language is configured as PlantUML and hands
everything else back unchanged — same highlighting, same copy button, same line numbers,
same titles.

```ts title="renderer.ts"
export async function renderDiagram(request: RenderDiagramRequest): Promise<string> {
  const cached = request.cache.get(key);
  if (cached !== undefined) return cached;
  return enqueueRender(() => engine.renderToString(request.source), request);
}
```

```python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

```json title="package.json"
{
  "plugins": ["@matfsw/docusaurus-plantuml-plugin"]
}
```

```bash
npm install @matfsw/docusaurus-plantuml-plugin
```

```
A fence with no language at all.
```

Inline code such as `plantuml` and `@startuml` is left alone too — only fenced blocks are
converted.

## Line highlighting still works

```ts title="Docusaurus magic comments are unaffected" {3}
const a = 1;
const b = 2;
const importantLine = a + b;
const c = 3;
```

## This page never loads the PlantUML runtime

There is no diagram here, so the ~8 MB engine is never requested. Check your network tab and
compare with any gallery page.
