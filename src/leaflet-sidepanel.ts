import * as L from 'leaflet';
import './leaflet-sidepanel.scss';

class SidePanel extends L.Control {
  public options: L.SidePanelOptions;
  private _panel: HTMLElement;

  constructor(id: string, options?: L.SidePanelOptions) {
    super(options);
    this.options = {
      panelPosition: 'left',
      hasTabs: true,
      tabsPosition: 'top',
      darkMode: false,
      pushControls: false,
      startTab: 1,
      onTabClick: undefined,
      ...options, // Merge with default options
    };
    if (!!options?.position) {
      const msg =
        'Leaflet.SidePanel: You cannot set the `position` option. It is controlled by the `panelPosition` option.';
      if (!!options?.panelPosition) console.warn(msg);
      else console.error(msg);
    }
    this._panel = L.DomUtil.get(id)!; // The `!` tells TypeScript we're sure the element exists
    L.setOptions(this, options);
  }

  addTo(map: L.Map): this {
    L.DomUtil.addClass(this._panel, 'sidepanel-' + this.options.panelPosition);

    if (this.options.darkMode) {
      L.DomUtil.addClass(this._panel, 'sidepanel-dark');
    }

    L.DomEvent.disableScrollPropagation(this._panel);
    L.DomEvent.disableClickPropagation(this._panel);

    if (this.options.hasTabs) {
      this._initTabs(map, this.options.tabsPosition);
    } else {
      this._initContent(map);
    }

    return this;
  }

  // Define the private methods as part of the class
  private _initContent(map: L.Map): void {
    this._toggleButton(map);
  }

  private _initTabs(
    map: L.Map,
    tabsPosition?: 'top' | 'bottom' | 'left' | 'right'
  ): void {
    if (typeof tabsPosition === 'string') {
      L.DomUtil.addClass(this._panel, 'tabs-' + tabsPosition);
    }

    const tabsLinks = this._panel.querySelectorAll(
      'a.sidebar-tab-link'
    ) as NodeListOf<HTMLAnchorElement>;
    const tabsContents = this._panel.querySelectorAll(
      '.sidepanel-tab-content'
    ) as NodeListOf<HTMLElement>;

    tabsLinks.forEach((tabLink, tabIndex) => {
      let startTab: HTMLElement | undefined;
      let startContent: HTMLElement | undefined;

      if (
        typeof this.options.startTab === 'number' &&
        this.options.startTab - 1 === tabIndex
      ) {
        startTab = tabLink;
        startContent = tabsContents[tabIndex];
      }

      if (
        typeof this.options.startTab === 'string' &&
        this.options.startTab === tabLink.dataset.tabLink
      ) {
        startTab = tabLink;
        startContent = this._panel.querySelector(
          `.sidepanel-tab-content[data-tab-content="${this.options.startTab}"]`
        ) as HTMLElement;
      }

      if (startTab && !L.DomUtil.hasClass(startTab, 'active')) {
        L.DomUtil.addClass(startTab, 'active');
        L.DomUtil.addClass(startContent!, 'active');
      }

      L.DomEvent.on(
        tabLink,
        'click',
        (e: Event) => {
          L.DomEvent.preventDefault(e);

          if (this.options.onTabClick) this.options.onTabClick(tabLink);

          if (!L.DomUtil.hasClass(tabLink, 'active')) {
            tabsLinks.forEach((link) => L.DomUtil.removeClass(link, 'active'));
            L.DomUtil.addClass(tabLink, 'active');

            tabsContents.forEach((element) => {
              if (tabLink.dataset.tabLink === element.dataset.tabContent) {
                L.DomUtil.addClass(element, 'active');
              } else {
                L.DomUtil.removeClass(element, 'active');
              }
            });
          }
        },
        tabLink
      );
    });

    this._toggleButton(map);
  }

  toggle(map: L.Map, _e?: Event): void {
    let IS_OPENED = true;
    const opened = L.DomUtil.hasClass(this._panel, 'opened');
    const closed = L.DomUtil.hasClass(this._panel, 'closed');

    if (!opened && !closed) {
      L.DomUtil.addClass(this._panel, 'opened');
    } else if (!opened && closed) {
      L.DomUtil.addClass(this._panel, 'opened');
      L.DomUtil.removeClass(this._panel, 'closed');
    } else if (opened && !closed) {
      IS_OPENED = false;
      L.DomUtil.removeClass(this._panel, 'opened');
      L.DomUtil.addClass(this._panel, 'closed');
    } else {
      L.DomUtil.addClass(this._panel, 'opened');
    }

    if (this.options.pushControls) {
      if (!map) {
        console.error(
          'Leaflet.SidePanel: You must pass the map instance to the toggle method when using pushControls option.'
        );
      }
      const controlsContainer = map
        .getContainer()
        .querySelector('.leaflet-control-container') as HTMLElement;

      L.DomUtil.addClass(controlsContainer, 'leaflet-anim-control-container');

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
    }
  }

  open(map: L.Map): void {
    const opened = L.DomUtil.hasClass(this._panel, 'opened');
    if (!opened) this.toggle(map);
  }

  close(map: L.Map): void {
    const closed = L.DomUtil.hasClass(this._panel, 'closed');
    if (!closed) this.toggle(map);
  }

  private _toggleButton(map: L.Map): void {
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
        this.toggle(map, _e);
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
