# v0.9.2 (Tue Dec 20 2022)

#### 🐛 Bug Fix

- Fix target url in error feedback [#234](https://github.com/storybookjs/test-runner/pull/234) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.9.1 (Mon Nov 21 2022)

#### 🐛 Bug Fix

- Release 0.9.1 [#223](https://github.com/storybookjs/test-runner/pull/223) ([@yannbf](https://github.com/yannbf) [@shilman](https://github.com/shilman))
- Fix missing dependencies [#209](https://github.com/storybookjs/test-runner/pull/209) ([@bryanjtc](https://github.com/bryanjtc))
- Make setup-page globally available for index.json mode compatibility [#217](https://github.com/storybookjs/test-runner/pull/217) ([@yannbf](https://github.com/yannbf))
- Upgrade nightly to next instead of future [#213](https://github.com/storybookjs/test-runner/pull/213) ([@shilman](https://github.com/shilman))

#### Authors: 3

- Bryan Thomas ([@bryanjtc](https://github.com/bryanjtc))
- Michael Shilman ([@shilman](https://github.com/shilman))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.9.0 (Wed Oct 12 2022)

#### 🚀 Enhancement

- feat: add cli option --ci [#204](https://github.com/storybookjs/test-runner/pull/204) ([@italoteix](https://github.com/italoteix))

#### 🐛 Bug Fix

- Upgrade preset-env to latest [#202](https://github.com/storybookjs/test-runner/pull/202) ([@shilman](https://github.com/shilman))
- Fix nightly check for failures [#197](https://github.com/storybookjs/test-runner/pull/197) ([@yannbf](https://github.com/yannbf))
- Improve error logging and ensure non-zero exit [#201](https://github.com/storybookjs/test-runner/pull/201) ([@IanVS](https://github.com/IanVS))

#### 📝 Documentation

- Docs: update coverage section now that the addon supports Vite [#205](https://github.com/storybookjs/test-runner/pull/205) ([@yannbf](https://github.com/yannbf))

#### Authors: 4

- Ian VanSchooten ([@IanVS](https://github.com/IanVS))
- Ítalo Teixeira ([@italoteix](https://github.com/italoteix))
- Michael Shilman ([@shilman](https://github.com/shilman))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.8.0 (Fri Oct 07 2022)

#### 🚀 Enhancement

- Add isTestRunner utility [#198](https://github.com/storybookjs/test-runner/pull/198) ([@yannbf](https://github.com/yannbf) [@IanVS](https://github.com/IanVS))

#### 🐛 Bug Fix

- Fix StorybookTestRunnerError – length on undefined [#194](https://github.com/storybookjs/test-runner/pull/194) ([@ericclemmons](https://github.com/ericclemmons))

#### Authors: 3

- Eric Clemmons ([@ericclemmons](https://github.com/ericclemmons))
- Ian VanSchooten ([@IanVS](https://github.com/IanVS))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.7.2 (Fri Sep 16 2022)

#### 🐛 Bug Fix

- Support Storybook 7.0 play function exceptions [#190](https://github.com/storybookjs/test-runner/pull/190) ([@tmeasday](https://github.com/tmeasday) [@yannbf](https://github.com/yannbf))
- fix snapshots & remove vscode color settings [#192](https://github.com/storybookjs/test-runner/pull/192) ([@ndelangen](https://github.com/ndelangen))

#### Authors: 4

- Michael Shilman ([@shilman](https://github.com/shilman))
- Norbert de Langen ([@ndelangen](https://github.com/ndelangen))
- Tom Coleman ([@tmeasday](https://github.com/tmeasday))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.7.1 (Tue Sep 06 2022)

#### 🐛 Bug Fix

- Add missing dependencies [#187](https://github.com/storybookjs/test-runner/pull/187) ([@IanVS](https://github.com/IanVS))

#### 📝 Documentation

- docs(README): Update a11y recipe [#186](https://github.com/storybookjs/test-runner/pull/186) (nagisa@hanayoku.com)

#### Authors: 4

- Ian VanSchooten ([@IanVS](https://github.com/IanVS))
- Michael Shilman ([@shilman](https://github.com/shilman))
- Nagisa Ando ([@nagisaando](https://github.com/nagisaando))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.7.0 (Fri Aug 26 2022)

### Release Notes

#### Update Jest to 28 ([#174](https://github.com/storybookjs/test-runner/pull/174))

This release updates the internal version of Jest to version 28. You can now remove `jest` and `jest-preset-playwright` from your `package.json` if you're not using them in other parts of your project!

---

#### 🚀 Enhancement

- Update Jest to 28 [#174](https://github.com/storybookjs/test-runner/pull/174) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.6.4 (Fri Aug 26 2022)

### Release Notes

#### add --junit flag to test runner ([#179](https://github.com/storybookjs/test-runner/pull/179))

The test runner now supports JUnit XML test reports out of the box with a `--junit` flag:
```sh
yarn test-storybook --junit
```

With that flag, the test runner will add `jest-junit` to the reporters list and generate a test report in a JUnit XML format. You can further configure the behavior of `jest-junit` by either setting specific `JEST_JUNIT_*` environment variables or by defining a `jest-junit` field in your package.json with the options you want, which will be respected when generating the report. You can look at all available options here: https://github.com/jest-community/jest-junit#configuration

---

#### 🐛 Bug Fix

- add --junit flag to test runner [#179](https://github.com/storybookjs/test-runner/pull/179) ([@yannbf](https://github.com/yannbf))

#### 📝 Documentation

- Add remark regarding different coverage providers [#180](https://github.com/storybookjs/test-runner/pull/180) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.6.3 (Wed Aug 24 2022)

### Release Notes

#### Support storyStoreV7 in coverage check ([#177](https://github.com/storybookjs/test-runner/pull/177))

This release fixes an issue where the coverage check was not working for projects using storyStoreV7.

---

#### 🐛 Bug Fix

- Support storyStoreV7 in coverage check [#177](https://github.com/storybookjs/test-runner/pull/177) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.6.2 (Wed Aug 24 2022)

### Release Notes

#### feat: turn Jest into an internal dependency ([#175](https://github.com/storybookjs/test-runner/pull/175))

The Storybook test runner will now contain Jest as an internal dependency, which means that if you installed Jest just for the purpose of using the Storybook test runner, you can now remove it!

---

#### 🐛 Bug Fix

- feat: turn Jest into an internal dependency [#175](https://github.com/storybookjs/test-runner/pull/175) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.6.1 (Tue Aug 23 2022)

### Release Notes

#### support Storybook 7.0 root selector ([#172](https://github.com/storybookjs/test-runner/pull/172))

### Feature:

In Storybook 7.0, the root selector changed from #root to #storybook-root. Both selectors are now supported in the internals of the test runner

---

#### 🐛 Bug Fix

- support Storybook 7.0 root selector [#172](https://github.com/storybookjs/test-runner/pull/172) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.6.0 (Tue Aug 23 2022)

### Release Notes

#### fix --watch cli option ([#168](https://github.com/storybookjs/test-runner/pull/168))

#### Fixes

The `--watch` flag was previously not working, and now it's fixed.

#### feat: throw error on unconfigured coverage when running with --coverage ([#166](https://github.com/storybookjs/test-runner/pull/166))

#### Features

The test runner now throws an error when running `yarn test-storybook --coverage` and the coverage is not correctly set up. This could mean that an user might be running `--coverage` without instrumenting their code with istanbul, which would lead to problems!

#### feat: add console logs on test failure ([#157](https://github.com/storybookjs/test-runner/pull/157))

#### Features

[feat: add console logs on test failure](https://github.com/storybookjs/test-runner/pull/157#top)
This version adds console logs to the output of failed tests, in order to as provide as much information as possible to help you diagnose your issues.

#### feat: jest 28 support ([#154](https://github.com/storybookjs/test-runner/pull/154))

### Features

This release updates `jest-playwright` to version [2.0.0](https://github.com/playwright-community/jest-playwright/releases/tag/v2.0.0) which adds support for Jest 28. In order to maintain backwards compatibility with Jest 27, you might have to take a few steps in case you are installing the test runner for the first time, or if you don't keep package locks in your project. 

You can find more info at https://github.com/storybookjs/test-runner#jest-27-support

---

#### 🚀 Enhancement

- feat: add console logs on test failure [#157](https://github.com/storybookjs/test-runner/pull/157) ([@yannbf](https://github.com/yannbf))
- feat: jest 28 support [#154](https://github.com/storybookjs/test-runner/pull/154) ([@andykenward](https://github.com/andykenward) [@yannbf](https://github.com/yannbf))

#### 🐛 Bug Fix

- Add commit hooks [#170](https://github.com/storybookjs/test-runner/pull/170) ([@yannbf](https://github.com/yannbf))
- undo Jest 28 support [#169](https://github.com/storybookjs/test-runner/pull/169) ([@yannbf](https://github.com/yannbf))
- fix --watch cli option [#168](https://github.com/storybookjs/test-runner/pull/168) ([@yannbf](https://github.com/yannbf))
- feat: throw error on unconfigured coverage when running with --coverage [#166](https://github.com/storybookjs/test-runner/pull/166) ([@yannbf](https://github.com/yannbf))
- Document new cli options [#167](https://github.com/storybookjs/test-runner/pull/167) ([@yannbf](https://github.com/yannbf))
- Add nightly check for failures [#165](https://github.com/storybookjs/test-runner/pull/165) ([@yannbf](https://github.com/yannbf))
- Update stories in example Storybook [#164](https://github.com/storybookjs/test-runner/pull/164) ([@yannbf](https://github.com/yannbf))
- use storybook@future on nightly script [#162](https://github.com/storybookjs/test-runner/pull/162) ([@yannbf](https://github.com/yannbf))

#### Authors: 2

- Andy Kenward ([@andykenward](https://github.com/andykenward))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.5.0 (Mon Jul 18 2022)

### Release Notes

#### Replace is-localhost-ip with can-bind-to-host ([#144](https://github.com/storybookjs/test-runner/pull/144))

### Features

This release replaces an internal dependency `is-localhost-ip` with `can-bind-to-host` due to a licensing issue in `can-bind-to-host`.

---

#### 🚀 Enhancement


#### Authors: 2

- Slava Knyazev ([@knyzorg](https://github.com/knyzorg))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.4.0 (Tue Jul 12 2022)

#### 🚀 Enhancement

- Fetch `index.json` and refer to "index json" mode. [#124](https://github.com/storybookjs/test-runner/pull/124) ([@tmeasday](https://github.com/tmeasday) [@yannbf](https://github.com/yannbf))

#### 🐛 Bug Fix

- fix: support index.html URLs [#139](https://github.com/storybookjs/test-runner/pull/139) ([@yannbf](https://github.com/yannbf))
- Document need for a custom snapshotResolver [#131](https://github.com/storybookjs/test-runner/pull/131) ([@FokkeZB](https://github.com/FokkeZB))

#### Authors: 4

- Fokke Zandbergen ([@FokkeZB](https://github.com/FokkeZB))
- Kaelig Deloumeau-Prigent ([@kaelig](https://github.com/kaelig))
- Tom Coleman ([@tmeasday](https://github.com/tmeasday))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.3.0 (Fri Jun 24 2022)

### Release Notes

#### Support code coverage ([#120](https://github.com/storybookjs/test-runner/pull/120))

#### Support code coverage ([#120](https://github.com/storybookjs/test-runner/pull/120))

---

#### 🚀 Enhancement

- Support code coverage [#120](https://github.com/storybookjs/test-runner/pull/120) ([@yannbf](https://github.com/yannbf))

#### 🐛 Bug Fix

- Improve code coverage for coverage merging [#130](https://github.com/storybookjs/test-runner/pull/130) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.2.0 (Tue Jun 21 2022)

### Release Notes

#### feat: provide global getStoryContext utility ([#125](https://github.com/storybookjs/test-runner/pull/125))



---

#### 🚀 Enhancement

- feat: provide global getStoryContext utility [#125](https://github.com/storybookjs/test-runner/pull/125) ([@yannbf](https://github.com/yannbf))

#### 🐛 Bug Fix

- chore(DEPS): update jest-playwright-preset [#119](https://github.com/storybookjs/test-runner/pull/119) ([@bodograumann](https://github.com/bodograumann))
- chore(CI): add sb versions to report [skip release] [#118](https://github.com/storybookjs/test-runner/pull/118) ([@yannbf](https://github.com/yannbf))
- feat: support DOM snapshot testing [#117](https://github.com/storybookjs/test-runner/pull/117) ([@yannbf](https://github.com/yannbf))
- Add reporting to CI [#113](https://github.com/storybookjs/test-runner/pull/113) ([@yannbf](https://github.com/yannbf))

#### 📝 Documentation

- Updates readme to lock Jest to version 27 [#115](https://github.com/storybookjs/test-runner/pull/115) ([@jonniebigodes](https://github.com/jonniebigodes))

#### Authors: 3

- [@jonniebigodes](https://github.com/jonniebigodes)
- Bodo Graumann ([@bodograumann](https://github.com/bodograumann))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.1.1 (Wed May 25 2022)

#### 🐛 Bug Fix

- Add Jest compatibility check [#111](https://github.com/storybookjs/test-runner/pull/111) ([@yannbf](https://github.com/yannbf))

#### 📝 Documentation

- Document issue with Jest on Windows CI [#105](https://github.com/storybookjs/test-runner/pull/105) ([@joshwooding](https://github.com/joshwooding))

#### Authors: 2

- Josh Wooding ([@joshwooding](https://github.com/joshwooding))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.1.0 (Thu May 19 2022)

### Release Notes

#### fix: Support Storybook 6.5 ([#107](https://github.com/storybookjs/test-runner/pull/107))

### Breaking change 💥 

This version adds support to Storybook 6.5 and drops support for Storybook 6.4. Unfortunately there was a breaking change in an internal API from `@storybook/store` which is used by the test runner, which **only affects users that use the auto title feature**. 

Changes included from [this pull request](https://github.com/storybookjs/test-runner/pull/107) (#107)

---

#### 🚀 Enhancement

- fix: Support Storybook 6.5 [#107](https://github.com/storybookjs/test-runner/pull/107) (valentin.palkovic.extern@elinvar.de [@yannbf](https://github.com/yannbf) [@valentinpalkovic](https://github.com/valentinpalkovic))

#### Authors: 3

- Valentin Palkovic ([@valentinpalkovic](https://github.com/valentinpalkovic))
- Valentin Palkovič (valentin.palkovic.extern@elinvar.de)
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.8 (Thu Apr 28 2022)

#### 🐛 Bug Fix

- Move storybook packages to peer deps [#101](https://github.com/storybookjs/test-runner/pull/101) ([@IanVS](https://github.com/IanVS) [@yannbf](https://github.com/yannbf))
- Limit jest to version 26 or 27 [#98](https://github.com/storybookjs/test-runner/pull/98) ([@bodograumann](https://github.com/bodograumann))

#### 📝 Documentation

- Document limitation for .mdx stories [#102](https://github.com/storybookjs/test-runner/pull/102) ([@IanVS](https://github.com/IanVS))

#### Authors: 3

- Bodo Graumann ([@bodograumann](https://github.com/bodograumann))
- Ian VanSchooten ([@IanVS](https://github.com/IanVS))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.7 (Fri Apr 22 2022)

#### 🐛 Bug Fix

- Fixup README typo. [#93](https://github.com/storybookjs/test-runner/pull/93) ([@MichaelHatherly](https://github.com/MichaelHatherly))
- Add output limit [#94](https://github.com/storybookjs/test-runner/pull/94) ([@yannbf](https://github.com/yannbf))

#### Authors: 2

- Michael Hatherly ([@MichaelHatherly](https://github.com/MichaelHatherly))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.6 (Tue Apr 12 2022)

#### 🐛 Bug Fix

- Log a warning if you try and run against a lazy-compiled storybook [#90](https://github.com/storybookjs/test-runner/pull/90) ([@tmeasday](https://github.com/tmeasday))

#### Authors: 2

- Tom Coleman ([@tmeasday](https://github.com/tmeasday))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.5 (Thu Apr 07 2022)

#### 🐛 Bug Fix

- cleanup page opened log [#86](https://github.com/storybookjs/test-runner/pull/86) ([@yannbf](https://github.com/yannbf))
- Add ability to test docs pages via VIEW_MODE env var [#79](https://github.com/storybookjs/test-runner/pull/79) ([@shilman](https://github.com/shilman))
- cleanup jsdom related code [#67](https://github.com/storybookjs/test-runner/pull/67) ([@yannbf](https://github.com/yannbf))

#### 🔩 Dependency Updates

- Cleanup dependencies [#72](https://github.com/storybookjs/test-runner/pull/72) ([@shilman](https://github.com/shilman))

#### Authors: 3

- Gert Hengeveld ([@ghengeveld](https://github.com/ghengeveld))
- Michael Shilman ([@shilman](https://github.com/shilman))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.4 (Wed Feb 23 2022)

#### 🐛 Bug Fix

- fix: use correct import in generated test [#65](https://github.com/storybookjs/test-runner/pull/65) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.3 (Wed Feb 23 2022)

#### 🐛 Bug Fix

- fix: reset page between tests [#47](https://github.com/storybookjs/test-runner/pull/47) ([@yannbf](https://github.com/yannbf))
- feat: add typeahead jest plugin [#61](https://github.com/storybookjs/test-runner/pull/61) ([@yannbf](https://github.com/yannbf))
- feat: auto detect stories json mode [#60](https://github.com/storybookjs/test-runner/pull/60) ([@yannbf](https://github.com/yannbf))
- feat: add url flag [#58](https://github.com/storybookjs/test-runner/pull/58) ([@yannbf](https://github.com/yannbf))
- feat: add browsers flag [#55](https://github.com/storybookjs/test-runner/pull/55) ([@yannbf](https://github.com/yannbf))
- fix: add  file location to eject error message [#57](https://github.com/storybookjs/test-runner/pull/57) ([@yannbf](https://github.com/yannbf))
- feat: add eject command [#54](https://github.com/storybookjs/test-runner/pull/54) ([@yannbf](https://github.com/yannbf))
- Test-runner file for hook configuration [#53](https://github.com/storybookjs/test-runner/pull/53) ([@shilman](https://github.com/shilman))
- feat: add update snapshot command to cli [#52](https://github.com/storybookjs/test-runner/pull/52) ([@yannbf](https://github.com/yannbf))
- fix: improve error message in start-storybook [#51](https://github.com/storybookjs/test-runner/pull/51) ([@yannbf](https://github.com/yannbf))
- Respect stories defined in main.js [#46](https://github.com/storybookjs/test-runner/pull/46) ([@yannbf](https://github.com/yannbf))

#### Authors: 2

- Michael Shilman ([@shilman](https://github.com/shilman))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.2 (Thu Feb 03 2022)

#### 🐛 Bug Fix

- Add setPreRender/setPostRender hooks & example [#38](https://github.com/storybookjs/test-runner/pull/38) ([@shilman](https://github.com/shilman) [@yannbf](https://github.com/yannbf))
- Add CLI wrapper [#41](https://github.com/storybookjs/test-runner/pull/41) ([@yannbf](https://github.com/yannbf))
- Cleanup play function checks [#37](https://github.com/storybookjs/test-runner/pull/37) ([@yannbf](https://github.com/yannbf))
- Support auto title stories [#35](https://github.com/storybookjs/test-runner/pull/35) ([@yannbf](https://github.com/yannbf))
- Add stories.json support [#31](https://github.com/storybookjs/test-runner/pull/31) ([@shilman](https://github.com/shilman))
- Add test runner to ci [#26](https://github.com/storybookjs/test-runner/pull/26) ([@yannbf](https://github.com/yannbf) [@shilman](https://github.com/shilman))
- Update ci recipes and timeout feedback [#27](https://github.com/storybookjs/test-runner/pull/27) ([@yannbf](https://github.com/yannbf))
- fix: move test-runner default configuration location and resolution [#25](https://github.com/storybookjs/test-runner/pull/25) ([@yannbf](https://github.com/yannbf))

#### 📝 Documentation

- docs(README): add section about jest [#29](https://github.com/storybookjs/test-runner/pull/29) ([@yannbf](https://github.com/yannbf))

#### Authors: 2

- Michael Shilman ([@shilman](https://github.com/shilman))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.0.1 (Thu Jan 06 2022)

#### 🐛 Bug Fix

- MVP Prototype [#11](https://github.com/storybookjs/test-runner/pull/11) ([@shilman](https://github.com/shilman) [@yannbf](https://github.com/yannbf))
- docs: update README with instructions [#17](https://github.com/storybookjs/test-runner/pull/17) ([@yannbf](https://github.com/yannbf))
- Clean up prototype [#16](https://github.com/storybookjs/test-runner/pull/16) ([@shilman](https://github.com/shilman))
- Sanitize target and reference urls and wait for Storybook selector before running test [#13](https://github.com/storybookjs/test-runner/pull/13) ([@yannbf](https://github.com/yannbf))

#### ⚠️ Pushed to `main`

- Fix prefix ([@shilman](https://github.com/shilman))
- add linear export to gh workflow ([@yannbf](https://github.com/yannbf))
- Initial commit ([@shilman](https://github.com/shilman))

#### Authors: 2

- Michael Shilman ([@shilman](https://github.com/shilman))
- Yann Braga ([@yannbf](https://github.com/yannbf))
