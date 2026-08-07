import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {PlantUmlPluginOptions} from '@matfsw/docusaurus-plantuml-plugin';

const organizationName = 'matf';
const projectName = 'docusaurus-plantuml-demo';

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
  onBrokenMarkdownLinks: 'throw',

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
              label: 'npm package',
              href: 'https://www.npmjs.com/package/@matfsw/docusaurus-plantuml-plugin',
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
      copyright: `Every diagram on this site was rendered in your browser. MIT licensed.`,
    },
    prism: {additionalLanguages: ['bash', 'json']},
  } satisfies Preset.ThemeConfig,
};

export default config;
