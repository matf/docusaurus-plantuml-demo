import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  demo: [
    'intro',
    {
      type: 'category',
      label: 'Diagram gallery',
      collapsed: false,
      items: [
        'gallery/sequence',
        'gallery/class',
        'gallery/activity',
        'gallery/state',
        'gallery/component',
        'gallery/entity-relationship',
        'gallery/mindmap',
        'gallery/graphviz',
      ],
    },
    {
      type: 'category',
      label: 'Standard library',
      collapsed: false,
      items: ['stdlib/c4', 'stdlib/notations', 'stdlib/sprites'],
    },
    {
      type: 'category',
      label: 'Deep links',
      collapsed: false,
      items: ['deeplinks/overview', 'deeplinks/from-nodes', 'deeplinks/runbook'],
    },
    {
      type: 'category',
      label: 'Plugin behaviour',
      collapsed: false,
      items: [
        'behaviour/zoom',
        'behaviour/dark-mode',
        'behaviour/many-diagrams',
        'behaviour/titles-and-aliases',
        'behaviour/errors',
        'behaviour/ordinary-code',
        'behaviour/commonmark',
        'behaviour/mermaid',
      ],
    },
  ],
};

export default sidebars;
