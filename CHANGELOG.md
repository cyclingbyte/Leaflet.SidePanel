# Leaflet.SidePanel Changelog

## v1.2.0 (2024-08-29) <img src="./examples/assets/language-typescript.svg" height="20px" />

- feat: add typescript <img src="./examples/assets/language-typescript.svg" height="16px" /> support
- feat: new option `onToggle`
- chore: improve docu
- chore: change prettier scope
- chore: ⚠️ BREAKING ⚠️ save map instance in panel<br>
  To update your code you have remove the map from `toggle`, `open` and `close` calls
- chore: ⚠️ BREAKING ⚠️ rename startTab to defaultTab

## v1.1.0 (2024-08-25)

- feat: trigger toggle, open, close programmatically with js
- feat: new option `onTabClick`
- fix: cannot toggle sidebar when hasTabs is false
- chore: Some change in docu, readme, ...

## v1.0.1 (2024-08-24)

- fix!: dist directory missing in public npm package

## v1.0.0 (2024-08-24)

Initial release.
(copy from [maxwell-ilai/Leaflet.SidePanel](https://github.com/maxwell-ilai/Leaflet.SidePanel 'Leaflet.SidePanel by maxwell-ilai') - optimized for NPM)
