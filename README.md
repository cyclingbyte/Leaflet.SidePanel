# Leaflet.SidePanel

Slide side panel plugin for [Leaflet](https://leafletjs.com/ 'Leaflet Homepage')

This repository is a copy of [maxwell-ilai/Leaflet.SidePanel](https://github.com/maxwell-ilai/Leaflet.SidePanel 'Leaflet.SidePanel by maxwell-ilai')

## Installation

### NPM

```sh
npm i Leaflet.SidePanel
```

## Requirements

- [leaflet](https://github.com/Leaflet/Leaflet) (v1.0.0 or higher)
  (Tested with 1.8.0)

## Options

- panelPosition: _'left' (default)_ | 'right' [string]
- hasTabs: _true (default)_ | false [boolean]
- tabsPosition: _'top' (default)_ | 'right' | 'bottom' | 'left' [string]
- darkMode: true | _false (default)_ [boolean]
- pushControls: true | _false (default)_ [boolean]
- startTab: _1 (default)_ [number | string]

## Example

**_Javascript_**

```javascript
import L from 'leaflet';
import 'leaflet.sidepanel';
import 'leaflet.sidepanel/dist/style.css';

const panelRight = L.control
  .sidepanel('panelID', {
    panelPosition: 'right',
    hasTabs: false,
    tabsPosition: 'top',
    pushControls: true,
    darkMode: true,
    startTab: 'tab-5',
  })
  .addTo(map);
```

**_Html_**

```html
<div id="panelID" class="sidepanel" aria-label="side panel" aria-hidden="false">
  <div class="sidepanel-inner-wrapper">
    <nav class="sidepanel-tabs-wrapper" aria-label="sidepanel tab navigation">
      <ul class="sidepanel-tabs">
        <li class="sidepanel-tab">
          <a href="#" class="sidebar-tab-link" role="tab" data-tab-link="tab-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path fill-rule="evenodd" />
            </svg>
          </a>
        </li>
        <!-- [...] -->
      </ul>
    </nav>
    <div class="sidepanel-content-wrapper">
      <div class="sidepanel-content">
        <div class="sidepanel-tab-content" data-tab-content="tab-1">
          <p>Content 1.</p>
        </div>
        <!-- [...] -->
      </div>
    </div>
  </div>
  <div class="sidepanel-toggle-container">
    <button
      class="sidepanel-toggle-button"
      type="button"
      aria-label="toggle side panel"
    />
  </div>
</div>
```

## Special Thanks

Special thanks to **[maxwell-ilai](https://github.com/maxwell-ilai 'Maxwell Ilai')** for the original project [maxwell-ilai/Leaflet.SidePanel](https://github.com/maxwell-ilai/Leaflet.SidePanel 'Leaflet.SidePanel by maxwell-ilai')
