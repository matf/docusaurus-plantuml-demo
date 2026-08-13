import {createRequire} from 'node:module';

import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {PlantUmlPluginOptions} from '@matfsw/docusaurus-plantuml-plugin';

const organizationName = 'matf';
const projectName = 'docusaurus-plantuml-demo';

/**
 * The plugin version this site was built against, read from the package actually installed
 * rather than written down by hand — a number nobody remembers to update is worse than no
 * number at all. The plugin lists `./package.json` in its `exports`, so this is a supported
 * entry point rather than a reach into its internals.
 */
const pluginVersion: string = (
  createRequire(import.meta.url)(
    '@matfsw/docusaurus-plantuml-plugin/package.json',
  ) as {version: string}
).version;

/**
 * Deployed to GitHub Pages under a project path, so `baseUrl` is not `/`. Every runtime
 * asset URL the plugin emits is prefixed with it — which is precisely the case that
 * tends to break with hand-rolled diagram integrations.
 */
const config: Config = {
  title: 'Docusaurus PlantUML plugin',
  tagline:
    'PlantUML and Graphviz diagrams rendered in your browser — no Java, no server, no CDN',
  favicon: 'img/favicon.svg',

  url: `https://${organizationName}.github.io`,
  baseUrl: `/${projectName}/`,
  organizationName,
  projectName,
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Diagram deep links are `#graph?highlight-node=…` hashes, resolved at runtime by the
  // plugin against the rendered SVG. Docusaurus checks every in-page anchor against the
  // heading ids it knows about, and there is no heading called `graph?highlight-node=…`,
  // so it reports each one as broken. The check is all-or-nothing, so a site that uses
  // deep links has to turn it off.
  onBrokenAnchors: 'ignore',

  markdown: {
    // `detect` picks the parser from the file extension: `.mdx` files are MDX, `.md` files
    // are (near-)CommonMark. Every page here is `.mdx` except `behaviour/commonmark.md`,
    // which exists to prove the plugin renders diagrams under the CommonMark parser too.
    format: 'detect',
    // `onBrokenMarkdownLinks` moved under `markdown.hooks` in Docusaurus 3.9. The top-level
    // option still works, but warns on every build and is removed in v4.
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },

  i18n: {defaultLocale: 'en', locales: ['en']},

  plugins: [
    [
      '@matfsw/docusaurus-plantuml-plugin',
      {
        languages: ['plantuml', 'puml'],
        theme: 'auto',
        lazy: true,
        cache: 'memory',
        sanitizeSvg: true,
        showSourceOnError: true,
        renderTimeoutMs: 20_000,
        // Spelled out rather than left to the defaults, because this site documents them.
        // `dot`, `graphviz` and `gv` fences are rendered by the Graphviz engine that
        // `@plantuml/core` already bundles for PlantUML's own layout — no extra download.
        graphviz: {
          enabled: true,
          languages: ['dot', 'graphviz', 'gv'],
          engine: 'dot',
          allowEngineOverride: true,
        },
      } satisfies PlantUmlPluginOptions,
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl: `https://github.com/${organizationName}/${projectName}/edit/main/`,
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'PlantUML for Docusaurus',
      items: [
        {type: 'docSidebar', sidebarId: 'demo', position: 'left', label: 'Demos'},
        {to: '/playground', label: 'Playground', position: 'left'},
        {
          href: 'https://www.npmjs.com/package/@matfsw/docusaurus-plantuml-plugin',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/matf/docusaurus-plantuml-plugin',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Project',
          items: [
            {
              label: 'Plugin repository',
              href: 'https://github.com/matf/docusaurus-plantuml-plugin',
            },
            {
              label: `Plugin v${pluginVersion}`,
              href: `https://www.npmjs.com/package/@matfsw/docusaurus-plantuml-plugin/v/${pluginVersion}`,
            },
            {label: 'This demo site', href: `https://github.com/${organizationName}/${projectName}`},
          ],
        },
        {
          title: 'Upstream',
          items: [
            {label: 'PlantUML', href: 'https://plantuml.com/'},
            {label: '@plantuml/core', href: 'https://www.npmjs.com/package/@plantuml/core'},
            {label: 'Graphviz', href: 'https://graphviz.org/'},
            {label: 'Docusaurus', href: 'https://docusaurus.io/'},
          ],
        },
      ],
      copyright:
        `Every diagram on this site was rendered in your browser by ` +
        `@matfsw/docusaurus-plantuml-plugin v${pluginVersion}. MIT licensed.`,
    },
    prism: {additionalLanguages: ['bash', 'json']},
  } satisfies Preset.ThemeConfig,
};

export default config;
