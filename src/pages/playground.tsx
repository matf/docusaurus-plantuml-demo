import {useCallback, useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PlantUmlDiagram from '@theme/PlantUmlDiagram';

import styles from './playground.module.css';

/** Time the editor stays quiet before the source is handed to the renderer. */
const DEBOUNCE_MS = 600;

/** Keys of the URL hash parameters carrying a shared diagram. */
const HASH_KEY = 'src';
const ENGINE_KEY = 'engine';

type Engine = 'plantuml' | 'graphviz';

const ENGINE_LABEL: Record<Engine, string> = {
  plantuml: 'PlantUML',
  graphviz: 'Graphviz (DOT)',
};

interface Example {
  label: string;
  engine: Engine;
  source: string;
}

const EXAMPLES: Example[] = [
  {
    label: 'Sequence',
    engine: 'plantuml',
    source: `@startuml
actor User
participant Browser
participant API
database Store

User -> Browser: Sign in
Browser -> API: POST /sessions
API -> Store: Verify credentials
Store --> API: Account
API --> Browser: Access token
Browser --> User: Signed in
@enduml`,
  },
  {
    label: 'Class',
    engine: 'plantuml',
    source: `@startuml
interface Renderer {
  +render(source: String): Svg
}

class BrowserRenderer implements Renderer {
  -cache: Cache
  +render(source: String): Svg
}

class Cache {
  +get(key: String): Svg
  +set(key: String, value: Svg)
}

BrowserRenderer o--> Cache
@enduml`,
  },
  {
    label: 'Activity',
    engine: 'plantuml',
    source: `@startuml
start
:Read the fenced block;
if (language is plantuml?) then (yes)
  :Load the runtime once;
  :Render in the browser;
  :Insert the SVG;
else (no)
  :Leave the code block alone;
endif
stop
@enduml`,
  },
  {
    label: 'State',
    engine: 'plantuml',
    source: `@startuml
[*] --> Idle
Idle --> Loading : diagram scrolled into view
Loading --> Rendering : runtime ready
Rendering --> Ready : SVG produced
Rendering --> Error : syntax error
Error --> Rendering : source edited
Ready --> [*]
@enduml`,
  },
  {
    label: 'Mindmap',
    engine: 'plantuml',
    source: `@startmindmap
* Playground
** Edit
*** Type PlantUML
*** Pick an example
** Render
*** In your browser
*** No server call
** Share
*** Copy link
*** Source lives in the URL
@endmindmap`,
  },
  {
    label: 'Dependency graph',
    engine: 'graphviz',
    source: `digraph {
  rankdir=LR;
  node [shape=box, style=rounded];

  cli -> core;
  cli -> config;
  web -> core;
  web -> render;
  render -> core;
  render -> cache;
  cache -> store;
  store -> core;
  config -> core;
}`,
  },
  {
    label: 'Clusters',
    engine: 'graphviz',
    source: `digraph {
  rankdir=LR;
  node [shape=box, style=rounded];

  subgraph cluster_edge {
    label="Edge";
    style=dashed;
    cdn; lb;
  }

  subgraph cluster_app {
    label="Application";
    style=dashed;
    gateway; orders;
  }

  browser [shape=oval];
  db [shape=cylinder];

  browser -> cdn -> lb -> gateway -> orders -> db;
}`,
  },
  {
    label: 'Colours',
    engine: 'graphviz',
    source: `digraph {
  rankdir=LR;
  node [shape=box, style=rounded];

  // Default black follows the page — toggle the navbar theme switch.
  defaults [label="default"];
  // Anything coloured here is left exactly as written, in both modes.
  red    [color="#d94f4f", fontcolor="#d94f4f"];
  filled [style="rounded,filled", fillcolor="#8fd694"];

  defaults -> red -> filled;
}`,
  },
  {
    label: 'Spring layout',
    engine: 'graphviz',
    source: `graph {
  layout=neato;
  node [shape=circle];

  a -- b; b -- c; c -- d; d -- a;
  a -- c; b -- d;
  a -- e; e -- c;
}`,
  },
  {
    label: 'State machine',
    engine: 'graphviz',
    source: `digraph {
  rankdir=LR;
  node [shape=circle];

  start [shape=point, width=0.15];
  done  [shape=doublecircle, label=""];

  start    -> draft;
  draft    -> placed   [label="submit"];
  placed   -> paid     [label="payment"];
  placed   -> canceled [label="cancel"];
  paid     -> shipped  [label="dispatch"];
  shipped  -> done     [label="delivered"];
  canceled -> done;
}`,
  },
];

/** The first example of each engine, used as that engine's starting point. */
function defaultSourceFor(engine: Engine): string {
  return EXAMPLES.find((example) => example.engine === engine)!.source;
}

const DEFAULT_SOURCE = defaultSourceFor('plantuml');

/**
 * URL-safe base64. The source is put in the hash rather than the query string so that it is
 * never sent to the server hosting this site — the whole point of the plugin is that diagram
 * source stays in the browser.
 */
function encodeSource(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeSource(value: string): string | null {
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    // A hand-edited or truncated link is not worth an error panel; fall back to the default.
    return null;
  }
}

interface SharedDiagram {
  source: string;
  engine: Engine;
}

/**
 * Reads a shared diagram out of the URL fragment.
 *
 * The engine parameter is optional so that links shared before Graphviz support still open —
 * they are PlantUML, which is what an absent parameter means.
 */
function readFromHash(): SharedDiagram | null {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === '') return null;
  const params = new URLSearchParams(hash);
  const encoded = params.get(HASH_KEY);
  if (encoded === null) return null;
  const source = decodeSource(encoded);
  if (source === null) return null;
  return {source, engine: params.get(ENGINE_KEY) === 'graphviz' ? 'graphviz' : 'plantuml'};
}

/** The fragment for a diagram. The engine is omitted for PlantUML, keeping links tidy. */
function hashFor({source, engine}: SharedDiagram): string {
  const engineParam = engine === 'graphviz' ? `&${ENGINE_KEY}=graphviz` : '';
  return `#${HASH_KEY}=${encodeSource(source)}${engineParam}`;
}

function Editor(): ReactNode {
  // The hash is read once, synchronously, so a shared link never flashes the default diagram.
  const initial = useMemo(() => readFromHash() ?? {source: DEFAULT_SOURCE, engine: 'plantuml' as Engine}, []);
  const [draft, setDraft] = useState(initial.source);
  const [engine, setEngine] = useState<Engine>(initial.engine);
  // The rendered engine moves with the rendered source, never ahead of it — otherwise
  // switching engine would briefly lay the old language out with the new engine and flash a
  // syntax error that was never real.
  const [rendered, setRendered] = useState<SharedDiagram>(initial);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const settled = draft === rendered.source && engine === rendered.engine;

  useEffect(() => {
    if (settled) return undefined;
    const timer = setTimeout(() => setRendered({source: draft, engine}), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, engine, settled]);

  // Only the settled source goes into the URL, so every keystroke does not push history state.
  useEffect(() => {
    const hash = hashFor(rendered);
    if (hash !== window.location.hash) {
      window.history.replaceState(null, '', hash);
    }
  }, [rendered]);

  /*
   * Opening a shared link while already on this page is a same-document navigation, so the
   * editor has to pick the new source up itself. `history.replaceState` above does not fire
   * this event, so the two cannot chase each other.
   */
  useEffect(() => {
    const onHashChange = (): void => {
      const shared = readFromHash();
      if (shared === null) return;
      setDraft(shared.source);
      setEngine(shared.engine);
      setRendered(shared);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const copyLink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}${hashFor({source: draft, engine})}`;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [draft, engine]);

  /**
   * Switching engine swaps in that engine's first example — but only when the editor still
   * holds an untouched example. Anything the reader typed themselves is kept, because
   * discarding their work would be far worse than showing them a syntax error.
   */
  const switchEngine = useCallback(
    (next: Engine) => {
      if (next === engine) return;
      const untouched = EXAMPLES.some((example) => example.source === draft);
      setEngine(next);
      if (untouched) setDraft(defaultSourceFor(next));
    },
    [draft, engine],
  );

  const pending = !settled;
  const lineCount = useMemo(() => draft.split('\n').length, [draft]);
  const examples = useMemo(() => EXAMPLES.filter((example) => example.engine === engine), [engine]);

  return (
    <div className="row">
      <div className="col col--6 margin-bottom--lg">
        <div className={styles.paneHeading}>
          <h2 className={styles.paneTitle}>Source</h2>
          <span className={styles.status} role="status">
            {pending ? 'Editing…' : `${lineCount} lines`}
          </span>
        </div>

        {/*
         * `role="group"` with `aria-pressed` buttons rather than a radio group: these are two
         * mutually exclusive actions on the editor, and readers expect Tab to move past them
         * rather than the arrow keys to cycle them.
         */}
        <div className={styles.engineSwitch} role="group" aria-label="Diagram language">
          {(Object.keys(ENGINE_LABEL) as Engine[]).map((candidate) => (
            <button
              key={candidate}
              type="button"
              className={clsx(
                'button button--sm',
                candidate === engine ? 'button--primary' : 'button--outline button--secondary',
              )}
              aria-pressed={candidate === engine}
              onClick={() => switchEngine(candidate)}
            >
              {ENGINE_LABEL[candidate]}
            </button>
          ))}
        </div>

        <textarea
          className={styles.editor}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            // Impatient authors get the render immediately instead of waiting out the debounce.
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault();
              setRendered({source: event.currentTarget.value, engine});
            }
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label={`${ENGINE_LABEL[engine]} source`}
        />

        <div className={styles.controls}>
          <span className={styles.controlsLabel}>Examples:</span>
          {examples.map((example) => (
            <button
              key={example.label}
              type="button"
              className="button button--sm button--outline button--primary"
              onClick={() => setDraft(example.source)}
            >
              {example.label}
            </button>
          ))}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className="button button--sm button--primary"
            onClick={copyLink}
          >
            {copied ? 'Link copied' : 'Copy link to this diagram'}
          </button>
          <button
            type="button"
            className="button button--sm button--secondary"
            onClick={() => setDraft(defaultSourceFor(engine))}
          >
            Reset
          </button>
        </div>

        <p className={styles.hint}>
          Rendering starts {DEBOUNCE_MS} ms after you stop typing; press{' '}
          <kbd className={styles.kbd}>Ctrl</kbd>/<kbd className={styles.kbd}>⌘</kbd> +{' '}
          <kbd className={styles.kbd}>Enter</kbd> to render at once. The source is stored in
          the URL fragment, so a copied link never reaches this site's server.
        </p>
      </div>

      <div className="col col--6 margin-bottom--lg">
        <div className={styles.paneHeading}>
          <h2 className={styles.paneTitle}>Preview</h2>
          <span className={styles.status}>rendered in your browser</span>
        </div>
        <div className={styles.preview}>
          <PlantUmlDiagram source={rendered.source} engine={rendered.engine} />
        </div>
      </div>
    </div>
  );
}

export default function Playground(): ReactNode {
  return (
    <Layout
      title="Playground"
      description="Type PlantUML or Graphviz DOT and watch it render live, entirely in your browser."
    >
      <main className="container margin-vert--lg">
        <h1>Playground</h1>
        <p className={styles.lede}>
          Type <strong>PlantUML</strong> or <strong>Graphviz DOT</strong> on the left and watch
          it render on the right — switch language with the buttons above the editor.
          Everything happens in this tab: the diagram source is never uploaded, and the same{' '}
          <code>@theme/PlantUmlDiagram</code> component that renders every fenced block in{' '}
          <Link to="/docs/intro">the demos</Link> is doing the work here. Graphviz costs no
          extra download — see the{' '}
          <Link to="/docs/gallery/graphviz">Graphviz gallery</Link> for why.
        </p>

        {/*
         * The editor keeps its state in the URL fragment and reads it during the first render,
         * which cannot happen while pre-rendering the page at build time.
         */}
        <BrowserOnly fallback={<p>Loading the editor…</p>}>{() => <Editor />}</BrowserOnly>
      </main>
    </Layout>
  );
}
