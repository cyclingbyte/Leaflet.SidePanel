const map = L.map('map', {
  zoomControl: false,
}).setView([51.505, -0.09], 13);

L.control.scale({ position: 'bottomleft' }).addTo(map);
L.control.zoom({ position: 'topleft' }).addTo(map);

const sidepanelLeft = L.control.sidepanel('mySidepanelLeft', {
  tabsPosition: 'left',
});
sidepanelLeft.addTo(map);

const sidepanelRight = L.control.sidepanel('mySidepanelRight', {
  hasTabs: false,
  panelPosition: 'right',
  pushControls: true,
  darkMode: true,
});
sidepanelRight.addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);