import * as L from 'leaflet';
import './leaflet-sidepanel.scss';

class SidePanel extends L.Control {
  public options: L.SidePanelOptions;
  private _panel: HTMLElement;
  private _map?: L.Map; // Optional 'cause it's initialized in `addTo`

  constructor(id: string, options?: L.SidePanelOptions) {
    // Check for invalid options
    options = options || {};
    if (!!options.position) {
      const msg =
        'Leaflet.SidePanel: You cannot set the `position` option. It is controlled by the `panelPosition` option.';
      if (!!options.panelPosition) console.warn(msg);
      else console.error(msg);
    }
    if (
      options.panelPosition &&
      !['left', 'right'].includes(options.panelPosition!)
    ) {
      console.error(
        'Leaflet.SidePanel: The `panelPosition` option must be either "left" or "right".'
      );
      options.panelPosition = 'left'; // Default value
    }
    if (
      options.tabsPosition &&
      !['top', 'bottom', 'left', 'right'].includes(options.tabsPosition!)
    ) {
      console.error(
        'Leaflet.SidePanel: The `tabsPosition` option must be either "top", "bottom", "left", or "right".'
      );
      options.tabsPosition = 'top'; // Default value
    }
    // Initialize the panel
    super(options);
    this.options = {
      panelPosition: 'left',
      hasTabs: true,
      tabsPosition: 'top',
      darkMode: false,
      pushControls: false,
      defaultTab: 1,
      size: '400px',
      onTabClick: () => {},
      onToggle: () => {},
      ...options, // Merge with default options
    };
    this._panel = L.DomUtil.get(id)!; // The `!` tells TypeScript we're sure the element exists
    this._panel.style.setProperty('--panel-width', this.options.size!); // `!` 'cause we have a default value

    // Set the options
    L.setOptions(this, options);
  }

  addTo(map: L.Map): this {
    this._map = map;

    L.DomUtil.addClass(this._panel, 'sidepanel-' + this.options.panelPosition);

    if (this.options.darkMode) {
      L.DomUtil.addClass(this._panel, 'sidepanel-dark');
    }

    L.DomEvent.disableScrollPropagation(this._panel);
    L.DomEvent.disableClickPropagation(this._panel);

    if (!!this.options.pushControls) {
      const map = this._map;
      const mapContainer = map instanceof L.Map ? map.getContainer() : map;
      const controlsContainer = mapContainer.querySelector(
        '.leaflet-control-container'
      ) as HTMLElement;

      L.DomUtil.addClass(
        controlsContainer,
        'leaflet-animate-control-container'
      );
      controlsContainer.style.setProperty(
        `--panel-width-${this.options.panelPosition}`,
        this.options.size!
      ); // `!` 'cause we have a default value
    }

    if (this.options.hasTabs) {
      this._initTabs(this.options.tabsPosition!); // `!` 'cause we have a default value
    } else {
      this._initContent();
    }

    return this;
  }

  // Define the private methods as part of the class
  private _initContent(): void {
    this._toggleButton();
  }

  private _initTabs(tabsPosition: 'top' | 'bottom' | 'left' | 'right'): void {
    L.DomUtil.addClass(this._panel, 'tabs-' + tabsPosition);

    const tabsLinks = this._panel.querySelectorAll(
      'a.sidebar-tab-link'
    ) as NodeListOf<HTMLAnchorElement>;
    const tabsContents = this._panel.querySelectorAll(
      '.sidepanel-tab-content'
    ) as NodeListOf<HTMLElement>;

    tabsLinks.forEach((tabLink, tabIndex) => {
      let defaultTab: boolean = false;
      let startContent: HTMLElement | undefined;

      if (
        typeof this.options.defaultTab === 'number' &&
        this.options.defaultTab - 1 === tabIndex
      ) {
        defaultTab = true;
        startContent = tabsContents[tabIndex];
      }

      if (
        typeof this.options.defaultTab === 'string' &&
        this.options.defaultTab === tabLink.dataset.tabLink
      ) {
        defaultTab = true;
        startContent = this._panel.querySelector(
          `.sidepanel-tab-content[data-tab-content="${this.options.defaultTab}"]`
        ) as HTMLElement;
      }

      if (defaultTab) {
        L.DomUtil.addClass(tabLink, 'active');
        L.DomUtil.addClass(startContent!, 'active');
      }

      L.DomEvent.on(
        tabLink,
        'click',
        (e: Event) => {
          L.DomEvent.preventDefault(e);

          tabsLinks.forEach((link) => L.DomUtil.removeClass(link, 'active'));
          L.DomUtil.addClass(tabLink, 'active');

          tabsContents.forEach((element) => {
            if (tabLink.dataset.tabLink === element.dataset.tabContent) {
              L.DomUtil.addClass(element, 'active');
            } else {
              L.DomUtil.removeClass(element, 'active');
            }
          });

          this.options.onTabClick!(tabLink); // `!` 'cause we have a default value
        },
        tabLink
      );
    });

    this._toggleButton();
  }

  toggle(_e?: Event): void {
    let IS_OPENED = true;
    const opened = L.DomUtil.hasClass(this._panel, 'opened');
    const closed = L.DomUtil.hasClass(this._panel, 'closed');

    if (!opened && !closed) {
      // If the panel is in its initial state
      L.DomUtil.addClass(this._panel, 'opened');
    } else if (!opened && closed) {
      L.DomUtil.addClass(this._panel, 'opened');
      L.DomUtil.removeClass(this._panel, 'closed');
    } else if (opened && !closed) {
      IS_OPENED = false;
      L.DomUtil.removeClass(this._panel, 'opened');
      L.DomUtil.addClass(this._panel, 'closed');
    }

    if (this.options.pushControls) {
      const map = this._map;
      if (!!map) {
        // TypeScript expects `map` to be an instance of `L.Map` but it can also be an HTMLElement
        // We assume that if it's not an instance of `L.Map`, it's an HTMLElement
        const mapContainer = map instanceof L.Map ? map.getContainer() : map;
        const controlsContainer = mapContainer.querySelector(
          '.leaflet-control-container'
        ) as HTMLElement;

        if (IS_OPENED) {
          L.DomUtil.removeClass(
            controlsContainer,
            this.options.panelPosition + '-closed'
          );
          L.DomUtil.addClass(
            controlsContainer,
            this.options.panelPosition + '-opened'
          );
        } else {
          L.DomUtil.removeClass(
            controlsContainer,
            this.options.panelPosition + '-opened'
          );
          L.DomUtil.addClass(
            controlsContainer,
            this.options.panelPosition + '-closed'
          );
        }
      } else {
        console.error(
          'Leaflet.SidePanel: You must add the SidePanel to the map before setting the `pushControls` option.'
        );
      }
    }

    this.options.onToggle!(IS_OPENED); // `!` 'cause we have a default value
  }

  isOpened(): boolean {
    return L.DomUtil.hasClass(this._panel, 'opened');
  }

  open(): void {
    if (!this.isOpened()) this.toggle();
  }

  close(): void {
    if (this.isOpened()) this.toggle();
  }

  private _toggleButton(): void {
    const container = this._panel.querySelector(
      '.sidepanel-toggle-container'
    ) as HTMLElement;
    const button = container.querySelector(
      '.sidepanel-toggle-button'
    ) as HTMLElement;

    L.DomEvent.on(
      button,
      'click',
      (_e: Event) => {
        this.toggle(_e);
      },
      container
    );
  }
}

L.Control.SidePanel = SidePanel;

L.control.sidepanel = function (
  id: string,
  options?: L.SidePanelOptions
): SidePanel {
  return new SidePanel(id, options);
};
