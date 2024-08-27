import * as L from 'leaflet';

declare module 'leaflet' {
  type SidePanelPosition = 'left' | 'right';
  type SidePanelTabsPosition = 'top' | 'bottom' | 'left' | 'right';

  interface SidePanelOptions extends L.ControlOptions {
    panelPosition?: SidePanelPosition;
    hasTabs?: boolean;
    tabsPosition?: SidePanelTabsPosition;
    darkMode?: boolean;
    pushControls?: boolean;
    startTab?: number | string;
    onTabClick?: (tabLink: HTMLElement) => void;
    onToggle?: (opened: boolean) => void;
  }
  namespace Control {
    class SidePanel extends L.Control {
      constructor(id: string, options?: SidePanelOptions);
      addTo(map: Map): this;
      toggle(map: Map, e?: Event): void;
      isOpened(): boolean;
      open(map: Map): void;
      close(map: Map): void;
    }
  }
  namespace control {
    function sidepanel(
      id: string,
      options?: SidePanelOptions
    ): Control.SidePanel;
  }
}
