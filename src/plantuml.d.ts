/**
 * The plugin ships this component, but `@theme/*` modules are only typed for the components
 * Docusaurus itself declares. Declaring it here lets the landing page use it from TypeScript.
 */
declare module '@theme/PlantUmlDiagram' {
  import type {ComponentType} from 'react';

  export interface Props {
    source: string;
    title?: string;
    language?: string;
    /** Which engine renders this diagram. Defaults to `plantuml`. */
    engine?: 'plantuml' | 'graphviz';
    /** Graphviz layout engine (`dot`, `neato`, `circo`, …). Ignored for PlantUML. */
    layout?: string;
    zoom?: boolean;
  }

  const PlantUmlDiagram: ComponentType<Props>;
  export default PlantUmlDiagram;
}
