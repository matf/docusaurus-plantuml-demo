---
sidebar_position: 1
title: Dark mode
---

# Dark mode

With `theme: 'auto'` (the default) a diagram follows the site's colour mode. **Toggle the
switch in the navbar and watch these re-render** — they are not recoloured with CSS filters,
they are re-rendered by PlantUML in the matching theme.

```plantuml title="Follows the site colour mode"
@startuml
actor User
participant "Light or dark?" as Q
User -> Q: Toggle the navbar switch
Q --> User: Re-rendered, not restyled
@enduml
```

Light and dark results are cached under separate keys, so switching back and forth is
instant after the first render of each, and a stale render can never be shown for the wrong
mode.

```plantuml title="Class diagram in both modes"
@startuml
class Renderer {
  +render(source, dark)
}
class Cache {
  +get(key)
  +set(key, svg)
}
note right of Cache
  Key includes the colour mode,
  the engine version and whether
  the SVG was sanitized.
end note
Renderer --> Cache
@enduml
```

## Pinning a theme

If you would rather diagrams always look the same, set `theme: 'light'` or `theme: 'dark'` in
the plugin options. The site colour mode is then ignored.
