import * as L from 'leaflet';

// Extend Leaflet's Control interface to include our custom control
declare module 'leaflet' {
  interface SidePanelOptions extends L.ControlOptions {
    panelPosition?: 'left' | 'right';
    hasTabs?: boolean;
    tabsPosition?: 'top' | 'bottom';
    darkMode?: boolean;
    pushControls?: boolean;
    startTab?: number | string;
    onTabClick?: (tabLink: HTMLElement) => void;
  }

  namespace Control {
    class SidePanel extends L.Control {
      constructor(id: string, options?: SidePanelOptions);

      addTo(map: L.Map): this;
      toggle(map: L.Map, e?: Event): void;
      open(map: L.Map): void;
      close(map: L.Map): void;
    }
  }

  namespace control {
    function sidepanel(
      id: string,
      options?: SidePanelOptions
    ): Control.SidePanel;
  }
}
