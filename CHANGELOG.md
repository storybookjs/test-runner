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
