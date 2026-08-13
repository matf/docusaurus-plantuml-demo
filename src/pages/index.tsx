import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import PlantUmlDiagram from '@theme/PlantUmlDiagram';

import styles from './index.module.css';

/** The same sources shown in the code panels beside them, so the two cannot drift apart. */
const DIAGRAM = `@startuml
actor User
participant Browser
participant API

User -> Browser: Sign in
Browser -> API: POST /sessions
API --> Browser: Access token
Browser --> User: Signed in
@enduml`;

const DOT = `digraph {
  rankdir=LR;
  node [shape=box, style=rounded];

  src -> build;
  build -> test;
  test -> deploy;
  test -> src [label="fix", style=dashed];
}`;

/**
 * Big enough that the viewer controls have something to do, and carrying an `id` so the deep
 * links beside it have a deterministic node to aim at.
 */
const VIEWER_DOT = `digraph {
  rankdir=LR;
  node [shape=box, style=rounded, fontsize=10];

  subgraph cluster_edge {
    label="Edge"; style=dashed; color="#4a6fa5";
    cdn [label="CDN"]; waf [label="WAF"]; lb [label="Load balancer"];
  }

  subgraph cluster_app {
    label="Application"; style=dashed; color="#4a8f5f";
    gateway [label="API gateway"];
    auth [label="Auth"]; orders [label="Orders"]; billing [label="Billing"];
    catalogue [label="Catalogue"]; search [label="Search"];
    recommend [label="Recommendations"]; notify [label="Notifications"];
  }

  subgraph cluster_data {
    label="Data"; style=dashed; color="#8a5aa5";
    ordersdb [id="ORDERS-DB", label="Orders DB", shape=cylinder];
    billingdb [label="Billing DB", shape=cylinder];
    index [label="Search index", shape=cylinder];
    warehouse [label="Warehouse", shape=cylinder];
    bus [label="Event bus", shape=cylinder];
  }

  cdn -> waf -> lb -> gateway;
  gateway -> auth; gateway -> orders; gateway -> billing;
  gateway -> catalogue; gateway -> search; gateway -> recommend;
  orders -> ordersdb; billing -> billingdb; catalogue -> index; search -> index;
  orders -> bus; billing -> bus; bus -> notify; bus -> warehouse;
  recommend -> warehouse;
}`;

const INSTALL = 'npm install @matfsw/docusaurus-plantuml-plugin';

const CONFIG = `// docusaurus.config.ts
plugins: [
  ['@matfsw/docusaurus-plantuml-plugin', {theme: 'auto', lazy: true}],
],`;

const FENCE = ['```plantuml title="Authentication sequence"', DIAGRAM, '```'].join('\n');
const DOT_FENCE = ['```dot title="Build pipeline"', DOT, '```'].join('\n');

const FEATURES: {title: string; body: ReactNode}[] = [
  {
    title: 'No server, no Java',
    body: (
      <>
        The official <code>@plantuml/core</code> engine runs in the browser. Nothing is sent to
        plantuml.com, Kroki, or any other service — your diagram source never leaves the page.
      </>
    ),
  },
  {
    title: 'No CDN',
    body: (
      <>
        The engine is copied into your own build output and served from your own origin, under
        your <code>baseUrl</code>. This site proves it: it is deployed under a project path.
      </>
    ),
  },
  {
    title: 'Just a fenced code block',
    body: (
      <>
        Write <code>```plantuml</code> — or <code>```dot</code> — in any <code>.md</code> or{' '}
        <code>.mdx</code> file. No swizzling, no imports, no per-page components.
      </>
    ),
  },
  {
    title: 'Graphviz too, for free',
    body: (
      <>
        PlantUML already uses Graphviz for its own layout, so <code>dot</code> fences reuse an
        engine your site was downloading anyway — Graphviz support costs zero extra bytes.
      </>
    ),
  },
  {
    title: 'Loaded only where needed',
    body: (
      <>
        The runtime is fetched lazily, only on pages that actually contain a diagram, and only
        once per session. A page with only <code>dot</code> diagrams never fetches the much
        larger PlantUML engine at all.
      </>
    ),
  },
];

const VIEWER_FEATURES: {title: string; body: ReactNode}[] = [
  {
    title: 'Maximize and Fit',
    body: (
      <>
        Maximizing opens the diagram fitted to the screen, however large it is. Fit brings that
        view back once you have zoomed or panned away from it.
      </>
    ),
  },
  {
    title: 'Minimap',
    body: (
      <>
        A small copy of the diagram with a rectangle marking what you are looking at. Press or
        drag anywhere on it to jump there.
      </>
    ),
  },
  {
    title: 'Search',
    body: (
      <>
        Find text inside the rendered diagram. Every match is highlighted, and stepping through
        them centres the view on each one in turn.
      </>
    ),
  },
  {
    title: 'Deep links',
    body: (
      <>
        A <code>#graph?highlight-node=…</code> URL names one node. Paste it into a ticket and
        the reader lands on that node, highlighted and centred.
      </>
    ),
  },
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="PlantUML and Graphviz diagrams in Docusaurus, rendered in the browser"
      description={siteConfig.tagline}
    >
      <header className={clsx('hero hero--primary', styles.hero)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--secondary button--lg" to="/docs/intro">
              See the demos
            </Link>
            <Link className="button button--secondary button--lg" to="/playground">
              Try it live
            </Link>
            <Link
              className="button button--outline button--secondary button--lg"
              href="https://www.npmjs.com/package/@matfsw/docusaurus-plantuml-plugin"
            >
              View on npm
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="container margin-vert--xl">
          <h2 className={styles.sectionTitle}>Two engines, one fenced code block</h2>
          <p className={styles.sectionLead}>
            Write the fence on the left, get the diagram on the right. Both were rendered by
            your browser just now — no server, no CDN, nothing sent anywhere.
          </p>

          <div className="row">
            <div className="col col--6">
              <div className={styles.engineCard}>
                <h3 className={styles.engineTitle}>
                  PlantUML <code>```plantuml</code>
                </h3>
                <CodeBlock language="markdown">{FENCE}</CodeBlock>
                <div className={styles.demoFrame}>
                  <PlantUmlDiagram source={DIAGRAM} title="Authentication sequence" />
                </div>
              </div>
            </div>

            <div className="col col--6">
              <div className={styles.engineCard}>
                <h3 className={styles.engineTitle}>
                  Graphviz <code>```dot</code>
                </h3>
                <CodeBlock language="markdown">{DOT_FENCE}</CodeBlock>
                <div className={styles.demoFrame}>
                  <PlantUmlDiagram source={DOT} engine="graphviz" title="Build pipeline" />
                </div>
              </div>
            </div>
          </div>

          <p className={styles.demoHint}>
            This page is a React component, not Markdown, so it uses the packaged{' '}
            <code>@theme/PlantUmlDiagram</code> component directly. In <code>.md</code> and{' '}
            <code>.mdx</code> you only ever write the fence. See the{' '}
            <Link to="/docs/gallery/graphviz">Graphviz gallery</Link> for layout engines,
            clusters and dark-mode behaviour.
          </p>
        </section>

        <section className="container margin-bottom--xl">
          <h2 className={styles.sectionTitle}>A viewer, not just a picture</h2>
          <p className={styles.sectionLead}>
            A diagram worth drawing is usually too big for a column of text. Every diagram comes
            with a viewer — zoom and pan, a maximized view fitted to the screen, a minimap, text
            search, and links that point at a single node. Try them on the graph below.
          </p>

          <div className={styles.demoFrame}>
            <PlantUmlDiagram source={VIEWER_DOT} engine="graphviz" title="Order platform" />
          </div>

          <div className="row margin-top--lg">
            {VIEWER_FEATURES.map((feature) => (
              <div key={feature.title} className="col col--3 margin-bottom--lg">
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </div>
            ))}
          </div>

          <p className={styles.demoHint}>
            Deep links work right here, on this page:{' '}
            <Link to="#graph?highlight-node=ORDERS-DB">highlight the Orders DB</Link> (by an
            explicit <code>id</code>) or <Link to="#graph?highlight-node=search">the search
            service</Link> (by its plain DOT node name). Both scroll the diagram into view,
            mark the node and centre on it. See{' '}
            <Link to="/docs/deeplinks/overview">Deep links</Link> for the PlantUML spelling and
            for links that cross pages.
          </p>
        </section>

        <section className="container margin-bottom--xl">
          <div className="row">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="col col--4 margin-bottom--lg">
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container margin-bottom--xl">
          <h2>Install</h2>
          <CodeBlock language="bash">{INSTALL}</CodeBlock>
          <CodeBlock language="ts">{CONFIG}</CodeBlock>
          <p>
            That is the whole setup. See <Link to="/docs/intro">the demos</Link> for the full
            option list and every diagram type.
          </p>
        </section>
      </main>
    </Layout>
  );
}
