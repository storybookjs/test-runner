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
