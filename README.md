# docusaurus-plantuml-demo

Live demo site for [`@matfsw/docusaurus-plantuml-plugin`][npm] — PlantUML diagrams rendered
entirely in the browser inside Docusaurus 3.

**→ [matf.github.io/docusaurus-plantuml-demo](https://matf.github.io/docusaurus-plantuml-demo)**

Every diagram on the site is rendered client-side by the official `@plantuml/core` engine.
There is no PlantUML server, no Kroki, no Java, and no CDN. The engine is served from the
site's own origin, under the project-path `baseUrl` that GitHub Pages requires — which is the
deployment shape most likely to break a diagram integration, and the reason this demo exists.

## What it shows

| Section              | Contents                                                                       |
| -------------------- | ------------------------------------------------------------------------------ |
| Diagram gallery      | Sequence, class, activity, state, component, ER, mindmap, WBS, Gantt            |
| Plugin behaviour     | Dark mode, many diagrams per page, fence titles and aliases, errors, plain code |

## Running it locally

```bash
npm install
npm start
```

To check a production build the way it is deployed:

```bash
npm run build
npm run serve
```

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
builds the site, asserts that the PlantUML runtime assets were actually emitted, and publishes
to GitHub Pages. There are no secrets — Pages deployment uses the workflow's OIDC token.

## Related

- Plugin source: [matf/docusaurus-plantuml-plugin](https://github.com/matf/docusaurus-plantuml-plugin)
- Package: [`@matfsw/docusaurus-plantuml-plugin`][npm]
- Engine: [`@plantuml/core`](https://www.npmjs.com/package/@plantuml/core)

## Licence

MIT.

[npm]: https://www.npmjs.com/package/@matfsw/docusaurus-plantuml-plugin
