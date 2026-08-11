---
sidebar_position: 2
title: Other notations
---

# ArchiMate and enterprise integration patterns

C4 gets the most attention, but two more modelling notations ship with the plugin. Each is a
macro library rather than a set of icons: you write `Business_Actor(...)` or `MsgChannel(...)`
and the library decides how it is drawn.

Each is one include, and each is fetched only by the pages that use it.

## ArchiMate

[Archimate-PlantUML](https://github.com/plantuml-stdlib/Archimate-PlantUML) covers the business,
application and technology layers, with ArchiMate's own relationship types.

```plantuml title="Publishing documentation, across three layers"
@startuml
!include <archimate/Archimate>

title Publishing documentation

Business_Actor(author, "Author")
Business_Process(write, "Write documentation")
Business_Service(docs, "Documentation service")

Application_Component(site, "Static site")
Application_Component(plugin, "Diagram plugin")
Application_Service(render, "Diagram rendering")

Technology_Node(runner, "CI runner")
Technology_Node(host, "Static host")
Technology_Service(https, "HTTPS delivery")

Rel_Assignment(author, write)
Rel_Realization(write, docs)
Rel_Serving(site, write)
Rel_Composition(site, plugin)
Rel_Realization(plugin, render)
Rel_Serving(render, site)
Rel_Assignment(runner, site)
Rel_Serving(https, docs)
Rel_Assignment(host, https)
@enduml
```

Relationships carry ArchiMate's notation, so composition, realization, serving and assignment
are visually distinct:

```plantuml title="Relationship types"
@startuml
!include <archimate/Archimate>

left to right direction

Business_Object(a, "Composition")
Business_Object(b, "Aggregation")
Business_Object(c, "Assignment")
Business_Object(d, "Realization")
Business_Object(e, "Serving")
Business_Object(f, "Triggering")

Application_Component(root, "Element")

Rel_Composition(root, a)
Rel_Aggregation(root, b)
Rel_Assignment(root, c)
Rel_Realization(root, d)
Rel_Serving(root, e)
Rel_Triggering(root, f)
@enduml
```

## Enterprise integration patterns

[EIP-PlantUML](https://github.com/plantuml-stdlib/EIP-PlantUML) draws Hohpe and Woolf's
messaging patterns with their published symbols — channels, routers, filters, translators.

```plantuml title="Order processing pipeline"
@startuml
!include <eip/EIP-PlantUML>

left to right direction

MsgChannel(intake, "orders.in")
MessageTranslator(normalize, "Normalize")
MessageFilter(valid, "Drop duplicates")
ContentBasedRouter(route, "By order type")
MsgChannel(physical, "warehouse.in")
MsgChannel(digital, "licensing.in")
DeadLetterChannel(dead, "orders.dead")

Send(intake, normalize)
Send(normalize, valid)
Send(valid, route)
Send(route, physical)
Send(route, digital)
Send(valid, dead)
@enduml
```

```plantuml title="Aggregating a scatter-gather"
@startuml
!include <eip/EIP-PlantUML>

left to right direction

MsgChannel(request, "quote.request")
MessageRouter(scatter, "Scatter")
MessageEndpoint(carrier1, "Carrier A")
MessageEndpoint(carrier2, "Carrier B")
MessageEndpoint(carrier3, "Carrier C")
Aggregator(gather, "Best quote")
MsgChannel(reply, "quote.reply")

Send(request, scatter)
Send(scatter, carrier1)
Send(scatter, carrier2)
Send(scatter, carrier3)
Send(carrier1, gather)
Send(carrier2, gather)
Send(carrier3, gather)
Send(gather, reply)
@enduml
```

## A notation that needs a namespace we do not ship

Not every standard library namespace is self-contained. `DomainStory` is small and MIT
licensed, but every element it draws resolves an icon out of `material2.1.19` — 6.8 MB of
icons — so it cannot render on its own. It is not bundled for that reason, and a page that
includes it says so:

```plantuml title="DomainStory, without the icons it depends on"
@startuml
!include <DomainStory/domainStory>

Boundary(Documentation) {
  Person(Author)
  Document(Markdown)
}
activity(1, Author, writes, Markdown)
@enduml
```

To use it, add both from a checkout:

```ts title="docusaurus.config.ts"
{
  stdlib: {
    include: ['domainstory', 'material2.1.19'],
    source: 'vendor/plantuml-stdlib/stdlib',
  },
}
```

## They compose with everything else

None of this is a special path through the plugin. These diagrams zoom, follow the site's
colour mode, show their source through the `</>` control, and are cached exactly like the
plain sequence diagram on the [start page](/docs/intro).
