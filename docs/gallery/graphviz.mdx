---
sidebar_position: 8
title: Graphviz (DOT)
---

# Graphviz diagrams

Everything above is PlantUML. This page is **Graphviz**, written in plain
[DOT](https://graphviz.org/doc/info/lang.html) and laid out in your browser by the same engine.

Write a `dot` fence — or `graphviz`, or `gv` — and that is all:

````markdown
```dot title="Build pipeline"
digraph {
  rankdir=LR;
  src -> build -> test -> deploy;
}
```
````

```dot title="Build pipeline"
digraph {
  rankdir=LR;
  node [shape=box, style=rounded];

  src -> build;
  build -> test;
  test -> deploy;
  test -> src [label="fix", style=dashed];
}
```

:::tip It costs nothing extra

PlantUML already uses Graphviz for its own layout, so the plugin has been shipping and loading
the Graphviz engine since day one. Rendering DOT reuses it. If your site already renders
PlantUML, **Graphviz support adds zero bytes** to what your readers download.

:::

## Dependency graphs

What DOT is best at: many nodes, many edges, and a layout you would not want to place by hand.

```dot title="Module dependency graph"
digraph {
  rankdir=LR;
  node [shape=box, style="rounded,filled", fillcolor="#eef4ff", color="#4a6fa5"];

  cli -> core;
  cli -> config;
  web -> core;
  web -> render;
  render -> core;
  render -> cache;
  config -> core;
  cache -> store;
  store -> core;
  api -> core;
  api -> render;
  api -> auth;
  auth -> store;
  worker -> render;
  worker -> store;
}
```

## Clusters

Subgraphs whose name begins with `cluster_` are drawn as boxes — the usual way to show
deployment or ownership boundaries.

```dot title="Request path across three tiers"
digraph {
  rankdir=LR;
  compound=true;
  node [shape=box, style=rounded];

  subgraph cluster_edge {
    label="Edge";
    style=dashed;
    cdn; lb;
  }

  subgraph cluster_app {
    label="Application";
    style=dashed;
    gateway; orders; billing;
  }

  subgraph cluster_data {
    label="Data";
    style=dashed;
    primary [shape=cylinder];
    replica [shape=cylinder];
  }

  browser [shape=oval];
  browser -> cdn -> lb -> gateway;
  gateway -> orders;
  gateway -> billing;
  orders -> primary;
  billing -> primary;
  primary -> replica [label="replication", style=dotted];
}
```

## Layout engines

Graphviz ships eleven layout engines. Add `engine=` to the fence to pick one — the same graph,
laid out four different ways:

````markdown
```dot engine=neato
graph { a -- b -- c -- a }
```
````

```dot title="dot — hierarchical (the default)"
digraph {
  a -> b; a -> c; b -> d; c -> d; d -> e;
}
```

```dot title="neato — spring model" engine=neato
graph {
  a -- b; a -- c; b -- d; c -- d; d -- e; e -- a;
}
```

```dot title="circo — circular" engine=circo
digraph {
  north -> east -> south -> west -> north;
  north -> south;
  east -> west;
}
```

```dot title="twopi — radial" engine=twopi
digraph {
  root -> a; root -> b; root -> c; root -> d;
  a -> a1; a -> a2;
  b -> b1; b -> b2; b -> b3;
  c -> c1;
  d -> d1; d -> d2;
}
```

Available engines: `circo`, `dot`, `fdp`, `neato`, `nop`, `nop1`, `nop2`, `osage`,
`patchwork`, `sfdp`, `twopi`.

## Record and table labels

```dot title="Record shapes"
digraph {
  rankdir=LR;
  node [shape=record];

  head  [label="{ <f0> head | <f1> next }"];
  mid   [label="{ <f0> 42 | <f1> next }"];
  tail  [label="{ <f0> 7 | <f1> null }"];

  head:f1 -> mid:f0;
  mid:f1  -> tail:f0;
}
```

HTML-like labels work too, and render as real SVG text — not as an embedded HTML island:

```dot title="HTML-like table label"
digraph {
  node [shape=plaintext];

  orders [label=<
    <table border="0" cellborder="1" cellspacing="0">
      <tr><td bgcolor="#4a6fa5"><font color="white"><b>orders</b></font></td></tr>
      <tr><td port="id">id — uuid</td></tr>
      <tr><td>customer_id — uuid</td></tr>
      <tr><td>total_cents — bigint</td></tr>
      <tr><td>placed_at — timestamptz</td></tr>
    </table>
  >];

  items [label=<
    <table border="0" cellborder="1" cellspacing="0">
      <tr><td bgcolor="#4a6fa5"><font color="white"><b>order_items</b></font></td></tr>
      <tr><td port="order">order_id — uuid</td></tr>
      <tr><td>sku — text</td></tr>
      <tr><td>quantity — int</td></tr>
    </table>
  >];

  orders:id -> items:order;
}
```

## Colours and dark mode

**Toggle the navbar switch and watch this one.** Graphviz has no dark theme of its own, so the
plugin does not re-render the graph — it renders on a transparent background and lets
Graphviz's default black strokes and text follow the page's text colour.

Anything you colour in the DOT source is left exactly as you wrote it, in both modes:

```dot title="Authored colours survive the colour mode"
digraph {
  rankdir=LR;
  node [shape=box, style=rounded];

  defaults [label="default\n(follows the page)"];
  red      [color="#d94f4f", fontcolor="#d94f4f", label="color=#d94f4f"];
  filled   [style="rounded,filled", fillcolor="#8fd694", label="fillcolor=#8fd694"];
  blue     [color="#4a6fa5", fontcolor="#4a6fa5", label="color=#4a6fa5"];

  defaults -> red -> filled -> blue;
}
```

Because nothing is re-rendered, toggling the theme on a page of DOT diagrams costs no layout
work at all — and it does not reset a diagram you have zoomed into.

## State machines

```dot title="Order lifecycle"
digraph {
  rankdir=LR;
  node [shape=circle, width=0.9];

  start [shape=point, width=0.15];
  done  [shape=doublecircle, width=0.7, label=""];

  start    -> draft;
  draft    -> placed   [label="submit"];
  placed   -> paid     [label="payment"];
  placed   -> canceled [label="cancel"];
  paid     -> shipped  [label="dispatch"];
  shipped  -> done     [label="delivered"];
  canceled -> done;
}
```

## Links

DOT's `URL` attribute becomes a real link in the rendered SVG. Click a node below.

Rendered SVG is sanitized before it reaches the page, so a `javascript:` URL in a diagram never
survives — the same protection that applies to PlantUML output.

```dot title="Clickable nodes"
digraph {
  rankdir=LR;
  node [shape=box, style=rounded, color="#4a6fa5", fontcolor="#4a6fa5"];

  lang  [label="DOT language", URL="https://graphviz.org/doc/info/lang.html", target="_blank"];
  attrs [label="Attributes",   URL="https://graphviz.org/doc/info/attrs.html", target="_blank"];
  shapes [label="Node shapes", URL="https://graphviz.org/doc/info/shapes.html", target="_blank"];

  lang -> attrs -> shapes;
}
```

## Zoom works the same

Every diagram on this page is zoomable, exactly like a PlantUML one — hover it, use the
toolbar, or focus it and press `+`, `-`, `0` and the arrow keys.

```dot title="Wide enough to be worth zooming"
digraph {
  rankdir=LR;
  node [shape=box, style=rounded, fontsize=10];

  ingress -> gateway;
  gateway -> auth; gateway -> orders; gateway -> billing; gateway -> search;
  gateway -> profile; gateway -> catalog; gateway -> reviews;
  orders -> primary; billing -> primary; profile -> primary; catalog -> replica;
  reviews -> replica; search -> index;
  primary -> replica [label="replication"];
  orders -> bus; billing -> bus; reviews -> bus;
  bus -> notifier; bus -> analytics; bus -> audit;
  notifier -> email; notifier -> push; notifier -> sms;
  analytics -> warehouse; audit -> warehouse;
}
```

## Invalid DOT

Graphviz reports the offending line, and the plugin shows you exactly what it said — no
guesswork, unlike PlantUML's rendered error pictures:

```dot title="Deliberately broken"
digraph {
  a -> ;
}
```

## Both engines, one page

Nothing stops you mixing them. This is a PlantUML fence, on the same page as all of the above:

```plantuml title="A PlantUML sequence diagram, right here"
@startuml
actor Author
participant "dot fence" as Dot
participant "plantuml fence" as Puml

Author -> Dot: ```dot
Author -> Puml: ```plantuml
Dot --> Author: laid out by Graphviz
Puml --> Author: laid out by PlantUML
@enduml
```
