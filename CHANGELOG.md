# Leaflet.SidePanel Changelog

## v1.2.1 (2024-09-18)

- feat: set panel width via options
- chore(tests): added tests
- chore(deps-dev): bump @types/node from 22.5.0 to 22.5.5
- chore(deps-dev): bump vite-plugin-dts from 4.0.3 to 4.2.1
- chore(deps-dev): bump eslint from 9.9.1 to 9.10.0
- chore(deps-dev): bump sass from 1.77.8 to 1.78.0
- chore(deps-dev): bump vite from 5.4.2 to 5.4.6

## v1.2.0 (2024-08-29)

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
