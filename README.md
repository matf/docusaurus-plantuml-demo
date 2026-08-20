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
to GitHub Pages. Pages deployment itself uses the workflow's OIDC token, with no secret involved.

`main` is protected: changes arrive as pull requests, and
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) must pass first. It builds the site the
same way the deploy does and runs the same runtime-asset assertion, so a dependency that breaks
the build is caught before it reaches the live site rather than after.

## Dependency updates

Dependabot opens **one** pull request a week for npm and one for GitHub Actions. Minor and patch
updates merge themselves as soon as `CI complete` is green, which redeploys the site. Majors ride
in the same pull request and are held for review, with a comment naming what holds them; a major
that cannot be taken at all belongs in an `ignore:` entry in
[`.github/dependabot.yml`](.github/dependabot.yml), with a note saying what breaks.

The merge is performed by a GitHub App rather than `GITHUB_TOKEN`. That is not cosmetic: GitHub
does not trigger workflow runs from `GITHUB_TOKEN` events, so a `GITHUB_TOKEN` merge would land
the update on `main` and never rebuild the site. The app needs `Contents` and `Pull requests`
write, and its credentials live in the `RELEASE_APP_ID` and `RELEASE_APP_PRIVATE_KEY` Actions
secrets — named for the plugin repository it is shared with, where it also cuts releases.

This is how the demo picks up new plugin versions: `@matfsw/docusaurus-plantuml-plugin` is an
ordinary dependency here, so a release reaches the site through the same weekly pull request.
Dependabot runs with `versioning-strategy: increase`, so it raises the declared range rather than
only the lockfile — `package.json` always names the plugin version the site is actually
demonstrating, instead of a `^1.5.0` that silently absorbs every 1.5.x.

## Related

- Plugin source: [matf/docusaurus-plantuml-plugin](https://github.com/matf/docusaurus-plantuml-plugin)
- Package: [`@matfsw/docusaurus-plantuml-plugin`][npm]
- Engine: [`@plantuml/core`](https://www.npmjs.com/package/@plantuml/core)

## Licence

MIT.

[npm]: https://www.npmjs.com/package/@matfsw/docusaurus-plantuml-plugin
