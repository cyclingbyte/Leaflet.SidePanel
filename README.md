[![npm version](https://img.shields.io/npm/v/leaflet.sidepanel)](https://www.npmjs.com/package/leaflet.sidepanel)
[![npm downloads](https://img.shields.io/npm/dt/leaflet.sidepanel)](https://www.npmjs.com/package/leaflet.sidepanel)
[![npm license](https://img.shields.io/npm/l/leaflet.sidepanel)](https://github.com/cyclingbyte/vue-leaflet-sidepanel?tab=MIT-1-ov-file#readme)
![last commit](https://img.shields.io/github/last-commit/cyclingbyte/Leaflet.SidePanel)
[![npm dependents](https://img.shields.io/librariesio/dependents/npm/leaflet.sidepanel)](https://www.npmjs.com/package/leaflet.sidepanel?activeTab=dependents)
![issues open](https://img.shields.io/github/issues/cyclingbyte/Leaflet.SidePanel)![issues closed](https://img.shields.io/github/issues-closed/cyclingbyte/Leaflet.SidePanel?label=)

<!-- ![git stars](https://img.shields.io/github/stars/cyclingbyte/Leaflet.SidePanel) -->

# Leaflet.SidePanel

Slide side panel plugin for [Leaflet](https://leafletjs.com/ 'Leaflet Homepage')

This repository is a copy of [maxwell-ilai/Leaflet.SidePanel](https://github.com/maxwell-ilai/Leaflet.SidePanel 'Leaflet.SidePanel by maxwell-ilai')

## Prerequirements

- [leaflet](https://github.com/Leaflet/Leaflet) (v1.0.0 or higher)
  (Tested with 1.8.0)

## Installation

```sh
# NPM
npm i leaflet.sidepanel

# yarn
yarn add leaflet.sidepanel

# pnpm
pnpm i leaflet.sidepanel
```

Or include the script and css in your html file

```html
<link
  rel="stylesheet"
  href="https://www.unpkg.com/leaflet.sidepanel@1.2.0/dist/style.css"
/>
<script src="https://www.unpkg.com/leaflet.sidepanel@1.2.0/dist/leaflet-sidepanel.umd.js"></script>
```

## Options

- panelPosition: _'left' (default)_ | 'right' [string]
- hasTabs: _true (default)_ | false [boolean]
- tabsPosition: _'top' (default)_ | 'right' | 'bottom' | 'left' [string]
- darkMode: true | _false (default)_ [boolean]
- pushControls: true | _false (default)_ [boolean]
- startTab: _1 (default)_ [number | string]

## Demo

You can find a demo [here](https://cyclingbyte.github.io/Leaflet.SidePanel/ 'Demo for Leaflet.SidePanel')

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
            <!-- [You can also use images / icons] -->
            Tab 1
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
    ></button>
  </div>
</div>
```

## Credits

Special thanks to **[maxwell-ilai](https://github.com/maxwell-ilai 'Maxwell Ilai')** for the original project [maxwell-ilai/Leaflet.SidePanel](https://github.com/maxwell-ilai/Leaflet.SidePanel 'Leaflet.SidePanel by maxwell-ilai')

## Visitors

[![Flag Counter](https://s01.flagcounter.com/count2/Qvel/bg_FFFFFF/txt_000000/border_CCCCCC/columns_6/maxflags_18/viewers_0/labels_0/pageviews_1/flags_0/percent_0/)](https://info.flagcounter.com/Qvel)
