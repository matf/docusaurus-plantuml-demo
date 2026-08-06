import {useCallback, useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PlantUmlDiagram from '@theme/PlantUmlDiagram';

import styles from './playground.module.css';

/** Time the editor stays quiet before the source is handed to the renderer. */
const DEBOUNCE_MS = 600;

/** Key of the URL hash parameter carrying a shared diagram. */
const HASH_KEY = 'src';

interface Example {
  label: string;
  source: string;
}

const EXAMPLES: Example[] = [
  {
    label: 'Sequence',
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
];

const DEFAULT_SOURCE = EXAMPLES[0].source;

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

function readSourceFromHash(): string | null {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === '') return null;
  const encoded = new URLSearchParams(hash).get(HASH_KEY);
  return encoded === null ? null : decodeSource(encoded);
}

function Editor(): ReactNode {
  // The hash is read once, synchronously, so a shared link never flashes the default diagram.
  const [draft, setDraft] = useState(() => readSourceFromHash() ?? DEFAULT_SOURCE);
  const [rendered, setRendered] = useState(draft);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (draft === rendered) return undefined;
    const timer = setTimeout(() => setRendered(draft), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [draft, rendered]);

  // Only the settled source goes into the URL, so every keystroke does not push history state.
  useEffect(() => {
    const hash = `#${HASH_KEY}=${encodeSource(rendered)}`;
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
      const shared = readSourceFromHash();
      if (shared === null) return;
      setDraft(shared);
      setRendered(shared);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const copyLink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}#${HASH_KEY}=${encodeSource(draft)}`;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [draft]);

  const pending = draft !== rendered;
  const lineCount = useMemo(() => draft.split('\n').length, [draft]);

  return (
    <div className="row">
      <div className="col col--6 margin-bottom--lg">
        <div className={styles.paneHeading}>
          <h2 className={styles.paneTitle}>Source</h2>
          <span className={styles.status} role="status">
            {pending ? 'Editing…' : `${lineCount} lines`}
          </span>
        </div>

        <textarea
          className={styles.editor}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            // Impatient authors get the render immediately instead of waiting out the debounce.
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault();
              setRendered(event.currentTarget.value);
            }
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="PlantUML source"
        />

        <div className={styles.controls}>
          <span className={styles.controlsLabel}>Examples:</span>
          {EXAMPLES.map((example) => (
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
            onClick={() => setDraft(DEFAULT_SOURCE)}
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
          <PlantUmlDiagram source={rendered} />
        </div>
      </div>
    </div>
  );
}

export default function Playground(): ReactNode {
  return (
    <Layout
      title="Playground"
      description="Type PlantUML and watch it render live, entirely in your browser."
    >
      <main className="container margin-vert--lg">
        <h1>Playground</h1>
        <p className={styles.lede}>
          Type PlantUML on the left and watch it render on the right. Everything happens in
          this tab: the diagram source is never uploaded, and the same{' '}
          <code>@theme/PlantUmlDiagram</code> component that renders every fenced block in{' '}
          <Link to="/docs/intro">the demos</Link> is doing the work here.
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
