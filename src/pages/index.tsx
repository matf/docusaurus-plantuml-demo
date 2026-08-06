import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import PlantUmlDiagram from '@theme/PlantUmlDiagram';

import styles from './index.module.css';

/** The same source shown in the code panel beside it, so the two cannot drift apart. */
const DIAGRAM = `@startuml
actor User
participant Browser
participant API

User -> Browser: Sign in
Browser -> API: POST /sessions
API --> Browser: Access token
Browser --> User: Signed in
@enduml`;

const INSTALL = 'npm install @matfsw/docusaurus-plantuml-plugin';

const CONFIG = `// docusaurus.config.ts
plugins: [
  ['@matfsw/docusaurus-plantuml-plugin', {theme: 'auto', lazy: true}],
],`;

const FENCE = ['```plantuml title="Authentication sequence"', DIAGRAM, '```'].join('\n');

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
        Write <code>```plantuml</code> in any <code>.md</code> or <code>.mdx</code> file. No
        swizzling, no imports, no per-page components.
      </>
    ),
  },
  {
    title: 'Loaded only where needed',
    body: (
      <>
        The ~8 MB runtime is fetched lazily, only on pages that actually contain a diagram, and
        only once per session. Pages without diagrams never touch it.
      </>
    ),
  },
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title="PlantUML diagrams in Docusaurus, rendered in the browser"
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
          <div className="row">
            <div className="col col--6">
              <h2>Write this</h2>
              <CodeBlock language="markdown">{FENCE}</CodeBlock>
            </div>
            <div className="col col--6">
              <h2>Get this</h2>
              <p>
                The diagram below is rendered by your browser, right now, from exactly the
                source on the left.
              </p>
              <div className={styles.demoFrame}>
                <PlantUmlDiagram source={DIAGRAM} title="Authentication sequence" />
              </div>
              <p className={styles.demoHint}>
                This page is a React component, not Markdown, so it uses the packaged{' '}
                <code>@theme/PlantUmlDiagram</code> component directly. In{' '}
                <code>.md</code> and <code>.mdx</code> you only ever write the fence.
              </p>
            </div>
          </div>
        </section>

        <section className="container margin-bottom--xl">
          <div className="row">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="col col--3 margin-bottom--lg">
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
