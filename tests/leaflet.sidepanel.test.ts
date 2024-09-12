import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as L from 'leaflet';
import { JSDOM } from 'jsdom';
import '../src/leaflet-sidepanel.scss';
import '../src/types/leaflet-sidepanel';
import '../src/leaflet-sidepanel';

describe('SidePanel', () => {
  let map: L.Map;
  let panelElement: HTMLElement;
  let sidePanel: L.Control.SidePanel;

  beforeEach(() => {
    // Create a DOM environment using JSDOM
    const dom = new JSDOM(
      `
      <!doctype html>
      <html lang="en">
        <body>
          <div id="map">
            <div id="mySidepanel" class="sidepanel" aria-label="side panel" aria-hidden="false">
              <div class="sidepanel-inner-wrapper">
                <div class="sidepanel-content-wrapper">
                  <div class="sidepanel-content">
                    <h4>Content</h4>
                    <p>Some content here...</p>
                  </div>
                </div>
              </div>
              <div class="sidepanel-toggle-container">
                <button class="sidepanel-toggle-button" type="button" aria-label="toggle side panel"></button>
              </div>
            </div>
          </div>
        </body>
      </html>`,
      { url: 'http://localhost' }
    );

    global.document = dom.window.document;
    global.window = dom.window;

    panelElement = document.getElementById('mySidepanel')!;
    map = L.map(document.getElementById('map')!);

    sidePanel = L.control
      .sidepanel('mySidepanel', { hasTabs: false, panelPosition: 'left' })
      .addTo(map);
  });

  it('should initialize the side panel correctly', () => {
    expect(sidePanel).toBeTruthy();
    expect(panelElement).toBeTruthy();
    expect(panelElement.classList.contains('sidepanel-left')).toBe(true);
    expect(panelElement.querySelector('.sidepanel-inner-wrapper')).toBeTruthy();
    expect(
      panelElement.querySelector('.sidepanel-toggle-container')
    ).toBeTruthy();
    expect(panelElement.querySelector('.sidepanel-toggle-button')).toBeTruthy();
  });

  it('should handle dark mode correctly', () => {
    sidePanel = L.control
      .sidepanel('mySidepanel', { darkMode: false })
      .addTo(map);
    expect(panelElement.classList.contains('sidepanel-dark')).toBe(false);
    sidePanel = L.control
      .sidepanel('mySidepanel', { darkMode: true })
      .addTo(map);
    expect(panelElement.classList.contains('sidepanel-dark')).toBe(true);
  });

  it('should correctly set panel position (left)', () => {
    const position = 'left';
    sidePanel = L.control
      .sidepanel('mySidepanel', { panelPosition: position })
      .addTo(map);
    expect(panelElement.classList.contains(`sidepanel-${position}`)).toBe(true);
  });
  it('should correctly set panel position (right)', () => {
    const position = 'right';
    sidePanel = L.control
      .sidepanel('mySidepanel', { panelPosition: position })
      .addTo(map);
    expect(panelElement.classList.contains(`sidepanel-${position}`)).toBe(true);
  });
  it('should correctly set panel position (default)', () => {
    sidePanel = L.control.sidepanel('mySidepanel').addTo(map);
    expect(panelElement.classList.contains(`sidepanel-left`)).toBe(true);
  });
  it('should correctly set panel position (invalid)', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const position = 'bottom';
    sidePanel = L.control
      .sidepanel('mySidepanel', { panelPosition: position as any }) // Cast to any to test invalid value
      .addTo(map);
    expect(errorSpy).toHaveBeenCalledWith(
      'Leaflet.SidePanel: The `panelPosition` option must be either "left" or "right".'
    );
    expect(panelElement.classList.contains(`sidepanel-left`)).toBe(true);
  });

  it('should toggle panel open and closed', () => {
    // initial state (closed, but without the class)
    expect(panelElement.classList.contains('closed')).toBe(false);
    expect(panelElement.classList.contains('opened')).toBe(false);
    sidePanel.toggle();
    expect(panelElement.classList.contains('closed')).toBe(false);
    expect(panelElement.classList.contains('opened')).toBe(true);
    sidePanel.toggle();
    expect(panelElement.classList.contains('closed')).toBe(true);
    expect(panelElement.classList.contains('opened')).toBe(false);
    sidePanel.toggle();
    expect(panelElement.classList.contains('closed')).toBe(false);
    expect(panelElement.classList.contains('opened')).toBe(true);
  });

  it('should correctly identify when the panel is opened or closed', () => {
    expect(sidePanel.isOpened()).toBe(false);
    sidePanel.toggle();
    expect(sidePanel.isOpened()).toBe(true);
    sidePanel.toggle();
    expect(sidePanel.isOpened()).toBe(false);
    sidePanel.toggle();
    expect(sidePanel.isOpened()).toBe(true);
  });

  it('should bind toggle button click event', () => {
    const toggleButton = panelElement.querySelector(
      '.sidepanel-toggle-button'
    ) as HTMLElement;
    const toggleSpy = vi.spyOn(sidePanel, 'toggle');
    toggleButton.click();
    expect(toggleSpy).toHaveBeenCalled();
  });

  it('should call onToggle callback when toggled', () => {
    const onToggle = vi.fn();
    sidePanel = L.control.sidepanel('mySidepanel', { onToggle }).addTo(map);

    sidePanel.toggle();
    expect(onToggle).toHaveBeenCalledWith(true);

    sidePanel.toggle();
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('should handle pushControls option correctly', () => {
    sidePanel = L.control
      .sidepanel('mySidepanel', { pushControls: true })
      .addTo(map);
    const options = sidePanel.options as L.SidePanelOptions; // Cast to SidePanelOptions

    // Ensure the class is added to
    const controlsContainer = document.querySelector(
      '.leaflet-control-container'
    ) as HTMLElement;
    expect(
      controlsContainer.classList.contains('leaflet-animate-control-container')
    ).toBe(true);

    sidePanel.toggle();
    expect(
      controlsContainer.classList.contains(options.panelPosition + '-opened')
    ).toBe(true);
    expect(
      controlsContainer.classList.contains(options.panelPosition + '-closed')
    ).toBe(false);

    sidePanel.toggle();
    expect(
      controlsContainer.classList.contains(options.panelPosition + '-opened')
    ).toBe(false);
    expect(
      controlsContainer.classList.contains(options.panelPosition + '-closed')
    ).toBe(true);

    sidePanel.toggle();
    expect(
      controlsContainer.classList.contains(options.panelPosition + '-opened')
    ).toBe(true);
    expect(
      controlsContainer.classList.contains(options.panelPosition + '-closed')
    ).toBe(false);
  });

  it('should warn if pushControls option is set before adding the side panel to the map', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    sidePanel = L.control.sidepanel('mySidepanel', { pushControls: true });
    sidePanel.toggle();
    expect(errorSpy).toHaveBeenCalledWith(
      'Leaflet.SidePanel: You must add the SidePanel to the map before setting the `pushControls` option.'
    );
  });

  it('should not move controls if pushControls is `false`', () => {
    sidePanel = L.control
      .sidepanel('mySidepanel') // pushControls is false by default
      .addTo(map);

    const controlsContainer = document.querySelector(
      '.leaflet-control-container'
    ) as HTMLElement;
    expect(
      controlsContainer.classList.contains('leaflet-animate-control-container')
    ).toBe(false);
    expect(
      controlsContainer.classList.toString().match(/-opened|-closed/g)
    ).toBeNull();
    sidePanel.toggle();
    expect(
      controlsContainer.classList.toString().match(/-opened|-closed/g)
    ).toBeNull();
  });

  it('should warn if position option is set', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Test case where position is set
    sidePanel = L.control
      .sidepanel('mySidepanel', { position: 'topleft', panelPosition: 'left' })
      .addTo(map);

    expect(warnSpy).toHaveBeenCalledWith(
      'Leaflet.SidePanel: You cannot set the `position` option. It is controlled by the `panelPosition` option.'
    );
    expect(errorSpy).not.toHaveBeenCalled();

    // Reset spies
    warnSpy.mockReset();
    errorSpy.mockReset();

    // Test case where panelPosition is not set
    sidePanel = L.control
      .sidepanel('mySidepanel', { position: 'topright' })
      .addTo(map);

    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      'Leaflet.SidePanel: You cannot set the `position` option. It is controlled by the `panelPosition` option.'
    );

    // Reset spies
    warnSpy.mockReset();
    errorSpy.mockReset();

    // Test not setting position (the expected behavior)
    sidePanel = L.control.sidepanel('mySidepanel').addTo(map);
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('should open the side panel when open() is called and it is closed', () => {
    sidePanel = L.control
      .sidepanel('mySidepanel', { panelPosition: 'left' })
      .addTo(map);

    // Initially, the panel should be closed
    L.DomUtil.addClass(panelElement, 'closed');

    expect(L.DomUtil.hasClass(panelElement, 'opened')).toBe(false);
    expect(L.DomUtil.hasClass(panelElement, 'closed')).toBe(true);

    sidePanel.open();

    expect(L.DomUtil.hasClass(panelElement, 'opened')).toBe(true);
    expect(L.DomUtil.hasClass(panelElement, 'closed')).toBe(false);
  });

  it('should not change state when open() is called and the panel is already opened', () => {
    sidePanel = L.control
      .sidepanel('mySidepanel', { panelPosition: 'left' })
      .addTo(map);

    // Initially, the panel should be opened
    L.DomUtil.addClass(panelElement, 'opened');

    expect(L.DomUtil.hasClass(panelElement, 'opened')).toBe(true);
    expect(L.DomUtil.hasClass(panelElement, 'closed')).toBe(false);

    sidePanel.open();

    expect(L.DomUtil.hasClass(panelElement, 'opened')).toBe(true);
    expect(L.DomUtil.hasClass(panelElement, 'closed')).toBe(false);
  });

  it('should close the side panel when close() is called and it is opened', () => {
    sidePanel = L.control
      .sidepanel('mySidepanel', { panelPosition: 'left' })
      .addTo(map);

    // Initially, the panel should be opened
    L.DomUtil.addClass(panelElement, 'opened');

    expect(L.DomUtil.hasClass(panelElement, 'opened')).toBe(true);
    expect(L.DomUtil.hasClass(panelElement, 'closed')).toBe(false);

    sidePanel.close();

    expect(L.DomUtil.hasClass(panelElement, 'opened')).toBe(false);
    expect(L.DomUtil.hasClass(panelElement, 'closed')).toBe(true);
  });

  it('should not change state when close() is called and the panel is already closed', () => {
    sidePanel = L.control
      .sidepanel('mySidepanel', { panelPosition: 'left' })
      .addTo(map);

    // Initially, the panel should be closed
    L.DomUtil.addClass(panelElement, 'closed');

    expect(L.DomUtil.hasClass(panelElement, 'opened')).toBe(false);
    expect(L.DomUtil.hasClass(panelElement, 'closed')).toBe(true);

    sidePanel.close();

    expect(L.DomUtil.hasClass(panelElement, 'opened')).toBe(false);
    expect(L.DomUtil.hasClass(panelElement, 'closed')).toBe(true);
  });

  it('should not render tabs if hasTabs is false', () => {
    sidePanel = L.control
      .sidepanel('mySidepanel', { hasTabs: false })
      .addTo(map);

    expect(L.DomUtil.hasClass(panelElement, 'tabs-top')).toBe(false); // No tabs should be present
  });
});

describe('SidePanel with Tabs', () => {
  let map: L.Map;
  let panelElement: HTMLElement;
  let sidePanel: L.Control.SidePanel;
  let panelId = 'mySidepanelLeft';

  beforeEach(() => {
    // Create a DOM environment using JSDOM
    const dom = new JSDOM(
      `
      <!doctype html>
      <html lang="en">
        <body>
          <div id="map">
            <div id="${panelId}" class="sidepanel" aria-label="side panel" aria-hidden="false">
              <div class="sidepanel-inner-wrapper">
                <nav class="sidepanel-tabs-wrapper" aria-label="sidepanel tab navigation">
                  <ul class="sidepanel-tabs">
                    <li class="sidepanel-tab">
                      <a href="#" class="sidebar-tab-link" role="tab" data-tab-link="tab-1">
                        <img src="./assets/list.svg" alt="List Icon" />
                      </a>
                    </li>
                    <li class="sidepanel-tab">
                      <a href="#" class="sidebar-tab-link" role="tab" data-tab-link="tab-2">
                        <img src="./assets/list.svg" alt="List Icon" />
                      </a>
                    </li>
                  </ul>
                </nav>
                <div class="sidepanel-content-wrapper">
                  <div class="sidepanel-content">
                    <div class="sidepanel-tab-content" data-tab-content="tab-1">
                      <h4>Content 1</h4>
                      <p>Some content here...</p>
                    </div>
                    <div class="sidepanel-tab-content" data-tab-content="tab-2">
                      <h4>Content 1</h4>
                      <p>Some content here...</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="sidepanel-toggle-container">
                <button class="sidepanel-toggle-button" type="button" aria-label="toggle side panel"></button>
              </div>
            </div>
          </div>
        </body>
      </html>`,
      { url: 'http://localhost' }
    );

    global.document = dom.window.document;
    global.window = dom.window;

    panelElement = document.getElementById(panelId)!;
    map = L.map(document.getElementById('map')!);
  });

  afterEach(() => {
    if (panelElement) {
      panelElement.remove();
    }
  });

  it('should trigger onTabClick when a tab is clicked', () => {
    const tabLink = panelElement.querySelector(
      '.sidebar-tab-link'
    ) as HTMLElement;

    const onTabClick = vi.fn();
    sidePanel = L.control
      .sidepanel(panelId, { hasTabs: true, onTabClick })
      .addTo(map);

    // Simulate tab click
    tabLink.click();
    expect(onTabClick).toHaveBeenCalledWith(tabLink);
  });

  it('should activate the default tab based on defaultTab option (string)', () => {
    sidePanel = L.control
      .sidepanel(panelId, {
        panelPosition: 'left',
        hasTabs: true,
        defaultTab: 'tab-2',
      })
      .addTo(map);

    // Check if the default tab and its content are active
    const defaultTabLink = panelElement.querySelector(
      'a[data-tab-link="tab-2"]'
    ) as HTMLAnchorElement;
    const defaultTabContent = panelElement.querySelector(
      '.sidepanel-tab-content[data-tab-content="tab-2"]'
    ) as HTMLElement;
    const allTabLinks = panelElement.querySelectorAll(
      'a.sidebar-tab-link'
    ) as NodeListOf<HTMLAnchorElement>;
    const allTabContents = panelElement.querySelectorAll(
      '.sidepanel-tab-content'
    ) as NodeListOf<HTMLElement>;

    expect(L.DomUtil.hasClass(defaultTabLink, 'active')).toBe(true);
    expect(L.DomUtil.hasClass(defaultTabContent, 'active')).toBe(true);

    // Ensure that other tabs and contents are not active
    allTabLinks.forEach((link) => {
      if (link !== defaultTabLink) {
        expect(L.DomUtil.hasClass(link, 'active')).toBe(false);
      }
    });

    allTabContents.forEach((content) => {
      if (content !== defaultTabContent) {
        expect(L.DomUtil.hasClass(content, 'active')).toBe(false);
      }
    });
  });

  it('should activate the default tab based on defaultTab option (number)', () => {
    sidePanel = L.control
      .sidepanel(panelId, {
        panelPosition: 'left',
        hasTabs: true,
        defaultTab: 2,
      })
      .addTo(map);

    // Check if the default tab and its content are active
    const defaultTabLink = panelElement.querySelector(
      'a[data-tab-link="tab-2"]'
    ) as HTMLAnchorElement;
    const defaultTabContent = panelElement.querySelector(
      '.sidepanel-tab-content[data-tab-content="tab-2"]'
    ) as HTMLElement;
    const allTabLinks = panelElement.querySelectorAll(
      'a.sidebar-tab-link'
    ) as NodeListOf<HTMLAnchorElement>;
    const allTabContents = panelElement.querySelectorAll(
      '.sidepanel-tab-content'
    ) as NodeListOf<HTMLElement>;

    expect(L.DomUtil.hasClass(defaultTabLink, 'active')).toBe(true);
    expect(L.DomUtil.hasClass(defaultTabContent, 'active')).toBe(true);

    // Ensure that other tabs and contents are not active
    allTabLinks.forEach((link) => {
      if (link !== defaultTabLink) {
        expect(L.DomUtil.hasClass(link, 'active')).toBe(false);
      }
    });

    allTabContents.forEach((content) => {
      if (content !== defaultTabContent) {
        expect(L.DomUtil.hasClass(content, 'active')).toBe(false);
      }
    });
  });

  it('should change tab when tabLink is clicked', () => {
    sidePanel = L.control.sidepanel(panelId).addTo(map);

    const tabLinks = panelElement.querySelectorAll(
      'a.sidebar-tab-link'
    ) as NodeListOf<HTMLAnchorElement>;
    const tabContents = panelElement.querySelectorAll(
      '.sidepanel-tab-content'
    ) as NodeListOf<HTMLElement>;

    // Check if the second tab and its content are active
    expect(L.DomUtil.hasClass(tabLinks[0], 'active')).toBe(true);
    expect(L.DomUtil.hasClass(tabContents[0], 'active')).toBe(true);
    expect(L.DomUtil.hasClass(tabLinks[1], 'active')).toBe(false);
    expect(L.DomUtil.hasClass(tabContents[1], 'active')).toBe(false);

    // Click the second tab
    tabLinks[1].click();

    // Check if the second tab and its content are active
    expect(L.DomUtil.hasClass(tabLinks[0], 'active')).toBe(false);
    expect(L.DomUtil.hasClass(tabContents[0], 'active')).toBe(false);
    expect(L.DomUtil.hasClass(tabLinks[1], 'active')).toBe(true);
    expect(L.DomUtil.hasClass(tabContents[1], 'active')).toBe(true);
  });

  it('should correctly set tabs position (top)', () => {
    sidePanel = L.control
      .sidepanel(panelId, { tabsPosition: 'top' })
      .addTo(map);

    expect(panelElement.classList.contains('tabs-top')).toBe(true);
  });
  it('should correctly set tabs position (bottom)', () => {
    sidePanel = L.control
      .sidepanel(panelId, { tabsPosition: 'bottom' })
      .addTo(map);

    expect(panelElement.classList.contains('tabs-bottom')).toBe(true);
  });
  it('should correctly set tabs position (left)', () => {
    sidePanel = L.control
      .sidepanel(panelId, { tabsPosition: 'left' })
      .addTo(map);

    expect(panelElement.classList.contains('tabs-left')).toBe(true);
  });
  it('should correctly set tabs position (right)', () => {
    sidePanel = L.control
      .sidepanel(panelId, { tabsPosition: 'right' })
      .addTo(map);

    expect(panelElement.classList.contains('tabs-right')).toBe(true);
  });
  it('should correctly set tabs position (default)', () => {
    sidePanel = L.control.sidepanel(panelId).addTo(map);

    expect(panelElement.classList.contains('tabs-top')).toBe(true);
  });
  it('should correctly set tabs position (invalid)', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    sidePanel = L.control
      .sidepanel(panelId, { tabsPosition: 'bottomright' as any }) // Cast to any to test invalid value
      .addTo(map);
    expect(errorSpy).toHaveBeenCalledWith(
      'Leaflet.SidePanel: The `tabsPosition` option must be either "top", "bottom", "left", or "right".'
    );
    expect(panelElement.classList.contains('tabs-top')).toBe(true);
  });
});

describe('SidePanel with HTMLElement', () => {
  let panelElement: HTMLElement;
  let sidePanel: L.Control.SidePanel;
  let map: L.Map;

  beforeEach(() => {
    // Create a DOM environment using JSDOM
    const dom = new JSDOM(
      `
      <!doctype html>
      <html lang="en">
        <body>
          <div id="map">
            <div id="mySidepanel" class="sidepanel" aria-label="side panel" aria-hidden="false">
              <div class="sidepanel-inner-wrapper">
                <div class="sidepanel-content-wrapper">
                  <div class="sidepanel-content">
                    <h4>Content</h4>
                    <p>Some content here...</p>
                  </div>
                </div>
              </div>
              <div class="sidepanel-toggle-container">
                <button class="sidepanel-toggle-button" type="button" aria-label="toggle side panel"></button>
              </div>
            </div>
          </div>
        </body>
      </html>`,
      { url: 'http://localhost' }
    );

    global.document = dom.window.document;
    global.window = dom.window;

    panelElement = document.getElementById('mySidepanel') as HTMLElement;

    L.map(document.getElementById('map') as HTMLElement);
    map = document.getElementById('map') as unknown as L.Map;
  });

  it('should handle map as HTMLElement', () => {
    sidePanel = L.control
      .sidepanel('mySidepanel', { panelPosition: 'left', pushControls: true })
      // leaflet expects a map instance but also accepts HTMLElement
      .addTo(map);

    const controlsContainer = (map as unknown as HTMLElement).querySelector(
      '.leaflet-control-container'
    ) as HTMLElement;
    expect(
      L.DomUtil.hasClass(controlsContainer, 'leaflet-animate-control-container')
    ).toBe(true);

    sidePanel.open(); // Open to apply changes
    expect(L.DomUtil.hasClass(controlsContainer, 'left-opened')).toBe(true);
    expect(L.DomUtil.hasClass(controlsContainer, 'left-closed')).toBe(false);

    sidePanel.close(); // Close to apply changes
    expect(L.DomUtil.hasClass(controlsContainer, 'left-closed')).toBe(true);
    expect(L.DomUtil.hasClass(controlsContainer, 'left-opened')).toBe(false);
  });
});
