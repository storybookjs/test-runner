# v0.23.0 (Wed Jun 11 2025)

#### 🚀 Enhancement

- Release v0.23.0 [#568](https://github.com/storybookjs/test-runner/pull/568) ([@yannbf](https://github.com/yannbf) [@tmeasday](https://github.com/tmeasday))
- Add out of the box support for a11y tests [#557](https://github.com/storybookjs/test-runner/pull/557) ([@yannbf](https://github.com/yannbf))

#### 🐛 Bug Fix

- Add telemetry to test run [#566](https://github.com/storybookjs/test-runner/pull/566) ([@yannbf](https://github.com/yannbf))
- fix a11y report checking bug [#562](https://github.com/storybookjs/test-runner/pull/562) ([@yannbf](https://github.com/yannbf))
- Fix: Support a11y disable parameter [#558](https://github.com/storybookjs/test-runner/pull/558) ([@yannbf](https://github.com/yannbf))
- Replace @storybook/csf with storybook's internal csf implementation [#556](https://github.com/storybookjs/test-runner/pull/556) ([@yannbf](https://github.com/yannbf))

#### Authors: 2

- Tom Coleman ([@tmeasday](https://github.com/tmeasday))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.22.1 (Sat Jun 07 2025)

#### 🐛 Bug Fix

- Patch: Add telemetry to test run [#565](https://github.com/storybookjs/test-runner/pull/565) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.22.0 (Fri Feb 28 2025)

#### 🚀 Enhancement

- Release v0.22.0 [#553](https://github.com/storybookjs/test-runner/pull/553) ([@ronakj](https://github.com/ronakj) [@ndelangen](https://github.com/ndelangen) [@kasperpeulen](https://github.com/kasperpeulen) [@yannbf](https://github.com/yannbf))
- Dependencies: Add sb9 alpha compatibility [#551](https://github.com/storybookjs/test-runner/pull/551) ([@ndelangen](https://github.com/ndelangen))

#### 🐛 Bug Fix

- Exclude new server component error [#552](https://github.com/storybookjs/test-runner/pull/552) ([@kasperpeulen](https://github.com/kasperpeulen))

#### Authors: 4

- Kasper Peulen ([@kasperpeulen](https://github.com/kasperpeulen))
- Norbert de Langen ([@ndelangen](https://github.com/ndelangen))
- Ronak Jain ([@ronakj](https://github.com/ronakj))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.21.3 (Thu Feb 20 2025)

#### 🐛 Bug Fix

- fix: Use StoryFinished event if available [#548](https://github.com/storybookjs/test-runner/pull/548) ([@valentinpalkovic](https://github.com/valentinpalkovic))

#### Authors: 1

- Valentin Palkovic ([@valentinpalkovic](https://github.com/valentinpalkovic))

---

# v0.21.2 (Tue Feb 18 2025)

#### 🐛 Bug Fix

- Revert "Fix a11y compatibility with Storybook 8.5 and above" [#546](https://github.com/storybookjs/test-runner/pull/546) ([@valentinpalkovic](https://github.com/valentinpalkovic))

#### Authors: 1

- Valentin Palkovic ([@valentinpalkovic](https://github.com/valentinpalkovic))

---

# v0.21.1 (Mon Feb 17 2025)

#### 🐛 Bug Fix

- Fix a11y compatibility with Storybook 8.5 and above [#536](https://github.com/storybookjs/test-runner/pull/536) ([@valentinpalkovic](https://github.com/valentinpalkovic))

#### Authors: 2

- Jeppe Reinhold ([@JReinhold](https://github.com/JReinhold))
- Valentin Palkovic ([@valentinpalkovic](https://github.com/valentinpalkovic))

---

# v0.21.0 (Fri Dec 20 2024)

#### 🚀 Enhancement

- Release 0.21.0 [#527](https://github.com/storybookjs/test-runner/pull/527) ([@kaelig](https://github.com/kaelig) [@guspan-tanadi](https://github.com/guspan-tanadi) [@yannbf](https://github.com/yannbf))
- Feature: Add --listTests flag from Jest [#521](https://github.com/storybookjs/test-runner/pull/521) ([@kaelig](https://github.com/kaelig))

#### 🐛 Bug Fix

- style(README): highlight Markdown Note section [#523](https://github.com/storybookjs/test-runner/pull/523) ([@guspan-tanadi](https://github.com/guspan-tanadi))
- Fix: Handle RSC errors [#526](https://github.com/storybookjs/test-runner/pull/526) ([@yannbf](https://github.com/yannbf))

#### Authors: 3

- Guspan Tanadi ([@guspan-tanadi](https://github.com/guspan-tanadi))
- Kaelig Deloumeau-Prigent ([@kaelig](https://github.com/kaelig))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.20.1 (Mon Dec 02 2024)

#### 🐛 Bug Fix

- Release 0.20.1 [#520](https://github.com/storybookjs/test-runner/pull/520) ([@yannbf](https://github.com/yannbf))
- Fix postVisit hook issue [#519](https://github.com/storybookjs/test-runner/pull/519) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.20.0 (Thu Nov 28 2024)

### Release Notes

#### Feature: Run postVisit on failures ([#494](https://github.com/storybookjs/test-runner/pull/494))

The test-runner's postVisit hook now runs even if there are failures. This allows you to, for instance, take snapshots on component failures. You can check whether the test has failed via the `hasFailure` property in the context passed to the hook:

```ts
const config: TestRunnerConfig = {
  async postVisit(_page, context) {
    if(context.hasFailure) {
      console.log('problems!')
      // do a snapshot, write a log, or anything you like
    }
  },
}
```

---

#### 🚀 Enhancement

- Release 0.20.0 [#518](https://github.com/storybookjs/test-runner/pull/518) ([@yannbf](https://github.com/yannbf) [@shilman](https://github.com/shilman))
- Feature: Run postVisit on failures [#494](https://github.com/storybookjs/test-runner/pull/494) ([@yannbf](https://github.com/yannbf))
- Release 0.20.0 [#514](https://github.com/storybookjs/test-runner/pull/514) ([@yannbf](https://github.com/yannbf) runner@fv-az773-358.an51pne1gm2ejjnmkprpigk40g.dx.internal.cloudapp.net)
- Align with Storybook 8.2 core package layout [#512](https://github.com/storybookjs/test-runner/pull/512) ([@yannbf](https://github.com/yannbf))

#### 📝 Documentation

- Fix tags docs [#497](https://github.com/storybookjs/test-runner/pull/497) ([@shilman](https://github.com/shilman) [@yannbf](https://github.com/yannbf))

#### Authors: 6

- Michael Shilman ([@shilman](https://github.com/shilman))
- shilman (runner@fv-az1567-4.ivwpl3vsblrubjity54i0equac.phxx.internal.cloudapp.net)
- shilman (runner@fv-az2031-358.rag0t2s20xiu3oejmeweyzhkrf.bx.internal.cloudapp.net)
- shilman (runner@fv-az738-609.ayi0s4js3kfu5apuyubnvt3std.cx.internal.cloudapp.net)
- shilman (runner@fv-az773-358.an51pne1gm2ejjnmkprpigk40g.dx.internal.cloudapp.net)
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.19.1 (Mon Jul 15 2024)

#### 🐛 Bug Fix

- Release 0.19.1 [#493](https://github.com/storybookjs/test-runner/pull/493) ([@paulgv](https://github.com/paulgv) [@yannbf](https://github.com/yannbf))
- fix(deps): upgrade `@storybook/csf` to v0.1.11 [#491](https://github.com/storybookjs/test-runner/pull/491) ([@paulgv](https://github.com/paulgv))

#### Authors: 2

- Paul Gascou-Vaillancourt ([@paulgv](https://github.com/paulgv))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.19.0 (Sat Jun 22 2024)

#### 🚀 Enhancement

- Release 0.19.0 [#486](https://github.com/storybookjs/test-runner/pull/486) ([@yannbf](https://github.com/yannbf) filip.witosz+textace@gmail.com [@ysgk](https://github.com/ysgk))
- Feat: Add errorMessageFormatter [#468](https://github.com/storybookjs/test-runner/pull/468) ([@yannbf](https://github.com/yannbf) filip.witosz+textace@gmail.com)

#### 🐛 Bug Fix

- Fix: Combine tags correctly when transforming story files [#485](https://github.com/storybookjs/test-runner/pull/485) ([@yannbf](https://github.com/yannbf))
- Fix contents of eject functionality [#483](https://github.com/storybookjs/test-runner/pull/483) ([@yannbf](https://github.com/yannbf))
- Unpin @swc/core from 1.5.7 [#481](https://github.com/storybookjs/test-runner/pull/481) ([@ysgk](https://github.com/ysgk))

#### Authors: 3

- [@ysgk](https://github.com/ysgk)
- Foxhoundn ([@Foxhoundn](https://github.com/Foxhoundn))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.18.2 (Wed May 29 2024)

#### 🐛 Bug Fix

- Release 0.18.2 [#476](https://github.com/storybookjs/test-runner/pull/476) ([@shilman](https://github.com/shilman) [@valentinpalkovic](https://github.com/valentinpalkovic) [@yannbf](https://github.com/yannbf))
- Fix 8.1.4+ support for v5 index.json [#475](https://github.com/storybookjs/test-runner/pull/475) ([@shilman](https://github.com/shilman) [@yannbf](https://github.com/yannbf))
- Pin `@swc/core` to 1.5.7 [#474](https://github.com/storybookjs/test-runner/pull/474) ([@shilman](https://github.com/shilman))

#### Authors: 3

- Michael Shilman ([@shilman](https://github.com/shilman))
- Valentin Palkovic ([@valentinpalkovic](https://github.com/valentinpalkovic))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.18.1 (Fri May 17 2024)

#### 🐛 Bug Fix

- Release 0.18.1 [#466](https://github.com/storybookjs/test-runner/pull/466) ([@yannbf](https://github.com/yannbf))
- Fix Windows support in coverage generation [#461](https://github.com/storybookjs/test-runner/pull/461) ([@yannbf](https://github.com/yannbf))
- Fix getStoryContext type [#462](https://github.com/storybookjs/test-runner/pull/462) ([@yannbf](https://github.com/yannbf))
- Fix: Skip requiring a main.js file in index.json mode [#464](https://github.com/storybookjs/test-runner/pull/464) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.18.0 (Thu May 09 2024)

#### 🚀 Enhancement

- Release 0.18.0 [#458](https://github.com/storybookjs/test-runner/pull/458) ([@skratchdot](https://github.com/skratchdot) [@yannbf](https://github.com/yannbf))
- Fix coverage reports, add lcov as extra reporter [#456](https://github.com/storybookjs/test-runner/pull/456) ([@yannbf](https://github.com/yannbf))

#### 🐛 Bug Fix

- add `--testTimeout` cli option from jest [#409](https://github.com/storybookjs/test-runner/pull/409) ([@skratchdot](https://github.com/skratchdot) [@yannbf](https://github.com/yannbf))

#### Authors: 2

- ◬ ([@skratchdot](https://github.com/skratchdot))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.17.0 (Mon Mar 11 2024)

#### 🚀 Enhancement

- Release 0.17.0 [#438](https://github.com/storybookjs/test-runner/pull/438) ([@JReinhold](https://github.com/JReinhold) [@shilman](https://github.com/shilman) [@valentinpalkovic](https://github.com/valentinpalkovic) [@yannbf](https://github.com/yannbf) [@ndelangen](https://github.com/ndelangen))
- Support Storybook 8 [#429](https://github.com/storybookjs/test-runner/pull/429) ([@yannbf](https://github.com/yannbf))
- Support unhandled rendering errors [#421](https://github.com/storybookjs/test-runner/pull/421) ([@yannbf](https://github.com/yannbf))

#### 🐛 Bug Fix

- Prebundle dependencies [#431](https://github.com/storybookjs/test-runner/pull/431) ([@yannbf](https://github.com/yannbf))
- Update internal example to Storybook 8 [#430](https://github.com/storybookjs/test-runner/pull/430) ([@yannbf](https://github.com/yannbf))
- swap storybook/jest to storybook/test [#427](https://github.com/storybookjs/test-runner/pull/427) ([@ndelangen](https://github.com/ndelangen))
- Add PR template [#428](https://github.com/storybookjs/test-runner/pull/428) ([@yannbf](https://github.com/yannbf))
- Fix build step [#425](https://github.com/storybookjs/test-runner/pull/425) ([@valentinpalkovic](https://github.com/valentinpalkovic))
- Remove --prerelease from sb upgrade CI [#423](https://github.com/storybookjs/test-runner/pull/423) ([@JReinhold](https://github.com/JReinhold))
- Support stories with meta id for permalinking [#419](https://github.com/storybookjs/test-runner/pull/419) ([@yannbf](https://github.com/yannbf))

#### 📝 Documentation

- Docs: Add remark regarding pnp support [#432](https://github.com/storybookjs/test-runner/pull/432) ([@yannbf](https://github.com/yannbf))
- docs: replace postRender(deprecated) with postVisit [#418](https://github.com/storybookjs/test-runner/pull/418) ([@junkisai](https://github.com/junkisai))

#### Authors: 6

- Jeppe Reinhold ([@JReinhold](https://github.com/JReinhold))
- Junki Saito ([@junkisai](https://github.com/junkisai))
- Michael Shilman ([@shilman](https://github.com/shilman))
- Norbert de Langen ([@ndelangen](https://github.com/ndelangen))
- Valentin Palkovic ([@valentinpalkovic](https://github.com/valentinpalkovic))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.16.0 (Mon Nov 27 2023)

#### 🚀 Enhancement

- Introduce logLevel configuration [#406](https://github.com/storybookjs/test-runner/pull/406) ([@yannbf](https://github.com/yannbf))

#### 🐛 Bug Fix

- Filter duplicated error messages in browser logs [#405](https://github.com/storybookjs/test-runner/pull/405) ([@yannbf](https://github.com/yannbf))
- Fix sync issues between tests [#404](https://github.com/storybookjs/test-runner/pull/404) ([@yannbf](https://github.com/yannbf))
- Refactor: Extract the setup page scripts into a separate file [#403](https://github.com/storybookjs/test-runner/pull/403) ([@yannbf](https://github.com/yannbf))
- Docs: Adds feedback form to migration documentation [#402](https://github.com/storybookjs/test-runner/pull/402) ([@jonniebigodes](https://github.com/jonniebigodes))
- Bump `jest-playwright-preset` from `v3.0.1` to `v4.0.0` [#400](https://github.com/storybookjs/test-runner/pull/400) ([@kemuridama](https://github.com/kemuridama))
- Improve type safety and code quality [#383](https://github.com/storybookjs/test-runner/pull/383) ([@bryanjtc](https://github.com/bryanjtc) [@yannbf](https://github.com/yannbf))
- Refactor: Improve internal code [#378](https://github.com/storybookjs/test-runner/pull/378) ([@bryanjtc](https://github.com/bryanjtc) [@yannbf](https://github.com/yannbf))

#### Authors: 4

- [@jonniebigodes](https://github.com/jonniebigodes)
- Bryan Thomas ([@bryanjtc](https://github.com/bryanjtc))
- Ryo Ochiai ([@kemuridama](https://github.com/kemuridama))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.15.2 (Tue Nov 21 2023)

#### 🐛 Bug Fix

- Remove Node 14 from engines field [#353](https://github.com/storybookjs/test-runner/pull/353) ([@legobeat](https://github.com/legobeat) [@yannbf](https://github.com/yannbf))
- Docs: Add react native remark to troubleshooting section [#398](https://github.com/storybookjs/test-runner/pull/398) ([@yannbf](https://github.com/yannbf))
- Fix "Browser has been closed" crash on uncaught page errors [#397](https://github.com/storybookjs/test-runner/pull/397) ([@yannbf](https://github.com/yannbf))
- Clarify difference between skipped and excluded tags [#396](https://github.com/storybookjs/test-runner/pull/396) ([@IanVS](https://github.com/IanVS) [@yannbf](https://github.com/yannbf))
- Refactor: Rename "render" hooks to "visit" hooks [#394](https://github.com/storybookjs/test-runner/pull/394) ([@yannbf](https://github.com/yannbf))
- Docs: Update tags documentation [#393](https://github.com/storybookjs/test-runner/pull/393) ([@yannbf](https://github.com/yannbf))

#### Authors: 3

- [@legobeat](https://github.com/legobeat)
- Ian VanSchooten ([@IanVS](https://github.com/IanVS))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.15.1 (Thu Nov 16 2023)

#### 🐛 Bug Fix

- fix: Make tags optional in TestRunnerConfig [#391](https://github.com/storybookjs/test-runner/pull/391) ([@stramel](https://github.com/stramel))

#### Authors: 2

- Michael Stramel ([@stramel](https://github.com/stramel))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.15.0 (Thu Nov 16 2023)

#### 🚀 Enhancement

- Add support for test filtering via tags [#382](https://github.com/storybookjs/test-runner/pull/382) ([@yannbf](https://github.com/yannbf))

#### 🐛 Bug Fix

- fix: switch `checkStorybook` to use `GET` method [#385](https://github.com/storybookjs/test-runner/pull/385) ([@stramel](https://github.com/stramel))
- Chore: update wait-on and lockfile [#389](https://github.com/storybookjs/test-runner/pull/389) ([@yannbf](https://github.com/yannbf))
- Add storyshots migration guides [#380](https://github.com/storybookjs/test-runner/pull/380) ([@yannbf](https://github.com/yannbf) [@shilman](https://github.com/shilman) [@jonniebigodes](https://github.com/jonniebigodes))

#### Authors: 4

- [@jonniebigodes](https://github.com/jonniebigodes)
- Michael Shilman ([@shilman](https://github.com/shilman))
- Michael Stramel ([@stramel](https://github.com/stramel))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.14.1 (Mon Nov 13 2023)

#### 🐛 Bug Fix

- Fix: Do not set test root outside index json mode [#387](https://github.com/storybookjs/test-runner/pull/387) ([@yannbf](https://github.com/yannbf))

#### Authors: 1

- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.14.0 (Wed Nov 08 2023)

#### 🚀 Enhancement

- Feature: Support .story files [#376](https://github.com/storybookjs/test-runner/pull/376) ([@yannbf](https://github.com/yannbf))
- BREAKING: Upgrade Jest to v29 [#348](https://github.com/storybookjs/test-runner/pull/348) ([@yannbf](https://github.com/yannbf) [@legobeat](https://github.com/legobeat))
- BREAKING: Bump minimum Node.js version to ^14.15.0 [#354](https://github.com/storybookjs/test-runner/pull/354) ([@legobeat](https://github.com/legobeat))
- Add waitForPageReady utility [#361](https://github.com/storybookjs/test-runner/pull/361) ([@yannbf](https://github.com/yannbf))

#### 🐛 Bug Fix

- Documentation: restructure docs and include more recipes [#373](https://github.com/storybookjs/test-runner/pull/373) ([@yannbf](https://github.com/yannbf))
- Run nyc with correct packager manager command [#364](https://github.com/storybookjs/test-runner/pull/364) ([@ferdinandhummel-gph](https://github.com/ferdinandhummel-gph) [@yannbf](https://github.com/yannbf))
- deps/devDeps: bump semver to latest [CVE-2022-25883] [#349](https://github.com/storybookjs/test-runner/pull/349) ([@legobeat](https://github.com/legobeat))
- Make userAgent configurable [#342](https://github.com/storybookjs/test-runner/pull/342) ([@jaknas](https://github.com/jaknas))
- devDeps: Bump auto from v10 to v11 [#346](https://github.com/storybookjs/test-runner/pull/346) ([@legobeat](https://github.com/legobeat))
- CI: Fix yarn 2 issue [#352](https://github.com/storybookjs/test-runner/pull/352) ([@yannbf](https://github.com/yannbf))
- chore: set `engines.node` to `>=12.0.0` [#351](https://github.com/storybookjs/test-runner/pull/351) ([@legobeat](https://github.com/legobeat))
- Maintenance: Update to yarn berry [#344](https://github.com/storybookjs/test-runner/pull/344) ([@yannbf](https://github.com/yannbf))
- Maintenance: Remove csf upgrade in nightly check [#343](https://github.com/storybookjs/test-runner/pull/343) ([@yannbf](https://github.com/yannbf))

#### 🏠 Internal

- chore: disable yarn telemetry by default [#350](https://github.com/storybookjs/test-runner/pull/350) ([@legobeat](https://github.com/legobeat))
- chore: dedupe dependency versions in `yarn.lock` [#347](https://github.com/storybookjs/test-runner/pull/347) ([@legobeat](https://github.com/legobeat))

#### 📝 Documentation

- Docs: Expand ejected config docs with an example [#363](https://github.com/storybookjs/test-runner/pull/363) ([@yannbf](https://github.com/yannbf))

#### Authors: 4

- [@ferdinandhummel-gph](https://github.com/ferdinandhummel-gph)
- [@legobeat](https://github.com/legobeat)
- Jakub Naskręski ([@jaknas](https://github.com/jaknas))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.13.0 (Fri Aug 04 2023)

#### 🚀 Enhancement

- Add ability to fail on console errors [#321](https://github.com/storybookjs/test-runner/pull/321) ([@work933k](https://github.com/work933k) [@yannbf](https://github.com/yannbf))
- Support importing stories from separate packages [#339](https://github.com/storybookjs/test-runner/pull/339) ([@yannbf](https://github.com/yannbf))

#### 🐛 Bug Fix

- Maintenance: Update storybook example to vite and typescript [#340](https://github.com/storybookjs/test-runner/pull/340) ([@yannbf](https://github.com/yannbf))
- Add coverage directory option [#272](https://github.com/storybookjs/test-runner/pull/272) ([@ferdinandhummel-gph](https://github.com/ferdinandhummel-gph) [@yannbf](https://github.com/yannbf))

#### Authors: 3

- [@ferdinandhummel-gph](https://github.com/ferdinandhummel-gph)
- [@work933k](https://github.com/work933k)
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.12.0 (Thu Jul 27 2023)

#### 🚀 Enhancement


#### 🐛 Bug Fix

- maintenance: remove no-manager-cache flag in example storybook [#331](https://github.com/storybookjs/test-runner/pull/331) ([@MH4GF](https://github.com/MH4GF))
- Fix extra args not being passed to jest [#322](https://github.com/storybookjs/test-runner/pull/322) ([@zyulyaev](https://github.com/zyulyaev) [@yannbf](https://github.com/yannbf))
- Fix empty coverage report [#324](https://github.com/storybookjs/test-runner/pull/324) ([@bryanjtc](https://github.com/bryanjtc) [@yannbf](https://github.com/yannbf))
- docs: fix github actions example for shard usage [#320](https://github.com/storybookjs/test-runner/pull/320) ([@MH4GF](https://github.com/MH4GF))

#### Authors: 5

- Bryan Thomas ([@bryanjtc](https://github.com/bryanjtc))
- Hirotaka Miyagi ([@MH4GF](https://github.com/MH4GF))
- Nikita Zyulyaev ([@zyulyaev](https://github.com/zyulyaev))
- Valentin Palkovic ([@valentinpalkovic](https://github.com/valentinpalkovic))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.11.0 (Tue Jun 20 2023)

#### 🚀 Enhancement

- Release 0.11.0 [#318](https://github.com/storybookjs/test-runner/pull/318) ([@bryanjtc](https://github.com/bryanjtc) [@yannbf](https://github.com/yannbf) [@ndelangen](https://github.com/ndelangen) [@unshame](https://github.com/unshame) [@valentinpalkovic](https://github.com/valentinpalkovic) [@vanessayuenn](https://github.com/vanessayuenn))
- Bundle with tsup and replace babel-jest [#250](https://github.com/storybookjs/test-runner/pull/250) ([@bryanjtc](https://github.com/bryanjtc) [@yannbf](https://github.com/yannbf) [@ndelangen](https://github.com/ndelangen))

#### 🐛 Bug Fix

- Change dependencies from `future` npm tag to `next` [#315](https://github.com/storybookjs/test-runner/pull/315) ([@yannbf](https://github.com/yannbf))
- fix: nyc command with shard option [#257](https://github.com/storybookjs/test-runner/pull/257) ([@bryanjtc](https://github.com/bryanjtc) [@yannbf](https://github.com/yannbf))
- Improve ejected config types [#297](https://github.com/storybookjs/test-runner/pull/297) ([@yannbf](https://github.com/yannbf))
- fix: Remove last reference to regenerator-runtime [#303](https://github.com/storybookjs/test-runner/pull/303) ([@bryanjtc](https://github.com/bryanjtc))
- fix(test-storybook): Fix test-runner-jest.config.js file not being found in STORYBOOK_CONFIG_DIR on Windows [#296](https://github.com/storybookjs/test-runner/pull/296) ([@unshame](https://github.com/unshame))
- Upgrade glob to v10 [#299](https://github.com/storybookjs/test-runner/pull/299) ([@valentinpalkovic](https://github.com/valentinpalkovic))

#### Authors: 6

- Bryan Thomas ([@bryanjtc](https://github.com/bryanjtc))
- Norbert de Langen ([@ndelangen](https://github.com/ndelangen))
- UnShame ([@unshame](https://github.com/unshame))
- Valentin Palkovic ([@valentinpalkovic](https://github.com/valentinpalkovic))
- Vanessa Yuen ([@vanessayuenn](https://github.com/vanessayuenn))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.10.0 (Mon Apr 03 2023)

#### 🚀 Enhancement

- New prerelease structure / upgrade to SB7 [#210](https://github.com/storybookjs/test-runner/pull/210) ([@shilman](https://github.com/shilman))

#### 🐛 Bug Fix

- Bump @storybook/csf to 0.1.0 [#288](https://github.com/storybookjs/test-runner/pull/288) ([@kasperpeulen](https://github.com/kasperpeulen))
- support Storybook 7.0.0 [#283](https://github.com/storybookjs/test-runner/pull/283) ([@yannbf](https://github.com/yannbf))
- Update getStorybookMain to throw an error if stories are not found in main.js [#278](https://github.com/storybookjs/test-runner/pull/278) ([@valentinpalkovic](https://github.com/valentinpalkovic))
- Extend hooks api with `prepare` and `getHttpHeaders` properties [#245](https://github.com/storybookjs/test-runner/pull/245) ([@yannbf](https://github.com/yannbf))
- Use preview api instead of store [#273](https://github.com/storybookjs/test-runner/pull/273) ([@kasperpeulen](https://github.com/kasperpeulen))
- Support other test-runner config extensions [#259](https://github.com/storybookjs/test-runner/pull/259) ([@yannbf](https://github.com/yannbf))
- Use ipv4 loopback address [#252](https://github.com/storybookjs/test-runner/pull/252) ([@IanVS](https://github.com/IanVS))
- Fix safe json stringify code [#239](https://github.com/storybookjs/test-runner/pull/239) ([@hansottowirtz](https://github.com/hansottowirtz))
- feat: add shard cli option [#243](https://github.com/storybookjs/test-runner/pull/243) ([@Niznikr](https://github.com/Niznikr) [@yannbf](https://github.com/yannbf))
- Updating deps to handle TS 4.9 [#237](https://github.com/storybookjs/test-runner/pull/237) ([@kasperpeulen](https://github.com/kasperpeulen))
- Fix target url in error feedback [#233](https://github.com/storybookjs/test-runner/pull/233) ([@yannbf](https://github.com/yannbf))
- Remove unused development packages [#227](https://github.com/storybookjs/test-runner/pull/227) ([@yannbf](https://github.com/yannbf))
- Make setup-page globally available for index.json mode compatibility [#217](https://github.com/storybookjs/test-runner/pull/217) ([@yannbf](https://github.com/yannbf))
- Upgrade CSF to next [#212](https://github.com/storybookjs/test-runner/pull/212) ([@shilman](https://github.com/shilman))
- Fix missing dependencies [#209](https://github.com/storybookjs/test-runner/pull/209) ([@bryanjtc](https://github.com/bryanjtc))

#### 📝 Documentation

- Document index.json mode for Svelte CSF [#263](https://github.com/storybookjs/test-runner/pull/263) ([@JReinhold](https://github.com/JReinhold))
- Docs: add recipe for browser name [#221](https://github.com/storybookjs/test-runner/pull/221) ([@yannbf](https://github.com/yannbf))

#### Authors: 9

- Bryan Thomas ([@bryanjtc](https://github.com/bryanjtc))
- Hans Otto Wirtz ([@hansottowirtz](https://github.com/hansottowirtz))
- Ian VanSchooten ([@IanVS](https://github.com/IanVS))
- Jeppe Reinhold ([@JReinhold](https://github.com/JReinhold))
- Kasper Peulen ([@kasperpeulen](https://github.com/kasperpeulen))
- Michael Shilman ([@shilman](https://github.com/shilman))
- Robert Niznik ([@Niznikr](https://github.com/Niznikr))
- Valentin Palkovic ([@valentinpalkovic](https://github.com/valentinpalkovic))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.9.4 (Wed Feb 01 2023)

#### 🐛 Bug Fix

- Release 0.9.4 [#258](https://github.com/storybookjs/test-runner/pull/258) ([@yannbf](https://github.com/yannbf))
- Support other test-runner config extensions [#259](https://github.com/storybookjs/test-runner/pull/259) ([@yannbf](https://github.com/yannbf))
- Use ipv4 loopback address [#252](https://github.com/storybookjs/test-runner/pull/252) ([@IanVS](https://github.com/IanVS))
- Fix safe json stringify code [#239](https://github.com/storybookjs/test-runner/pull/239) ([@hansottowirtz](https://github.com/hansottowirtz))

#### Authors: 3

- Hans Otto Wirtz ([@hansottowirtz](https://github.com/hansottowirtz))
- Ian VanSchooten ([@IanVS](https://github.com/IanVS))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

# v0.9.3 (Fri Jan 20 2023)

#### 🐛 Bug Fix

- feat: add shard cli option [#246](https://github.com/storybookjs/test-runner/pull/246) ([@yannbf](https://github.com/yannbf))
- feat: add shard cli option [#243](https://github.com/storybookjs/test-runner/pull/243) ([@Niznikr](https://github.com/Niznikr) [@yannbf](https://github.com/yannbf))

#### Authors: 2

- Robert Niznik ([@Niznikr](https://github.com/Niznikr))
- Yann Braga ([@yannbf](https://github.com/yannbf))

---

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
