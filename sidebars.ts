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
      ],
    },
    {
      type: 'category',
      label: 'Plugin behaviour',
      collapsed: false,
      items: [
        'behaviour/dark-mode',
        'behaviour/many-diagrams',
        'behaviour/titles-and-aliases',
        'behaviour/errors',
        'behaviour/ordinary-code',
      ],
    },
  ],
};

export default sidebars;
