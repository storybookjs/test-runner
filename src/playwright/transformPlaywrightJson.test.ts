import dedent from 'ts-dedent';
import { transformPlaywrightJson } from './transformPlaywrightJson';

describe('Playwright Json', () => {
  it('should generate a test for each story', () => {
    const input = dedent`{
      "v": 3,
      "stories": {
        "example-header--logged-in": {
          "id": "example-header--logged-in",
          "title": "Example/Header",
          "name": "Logged In",
          "importPath": "./stories/basic/Header.stories.js",
          "kind": "Example/Header",
          "story": "Logged In",
          "parameters": {
            "__id": "example-header--logged-in",
            "docsOnly": false,
            "fileName": "./stories/basic/Header.stories.js"
          }
        },
        "example-header--logged-out": {
          "id": "example-header--logged-out",
          "title": "Example/Header",
          "name": "Logged Out",
          "importPath": "./stories/basic/Header.stories.js",
          "kind": "Example/Header",
          "story": "Logged Out",
          "parameters": {
            "__id": "example-header--logged-out",
            "docsOnly": false,
            "fileName": "./stories/basic/Header.stories.js"
          }
        },
        "example-page--logged-in": {
          "id": "example-page--logged-in",
          "title": "Example/Page",
          "name": "Logged In",
          "importPath": "./stories/basic/Page.stories.js",
          "kind": "Example/Page",
          "story": "Logged In",
          "parameters": {
            "__id": "example-page--logged-in",
            "docsOnly": false,
            "fileName": "./stories/basic/Page.stories.js"
          }
        }
      }
    }`;
    expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
Object {
  "example-header": "describe(\\"Example/Header\\", () => {
  describe(\\"Logged In\\", () => {
    it(\\"test\\", async () => {
      page.on('pageerror', err => {
        page.evaluate(({
          id,
          err
        }) => __throwError(id, err), {
          id: \\"example-header--logged-in\\",
          err: err.message
        });
      });
      return page.evaluate(({
        id,
        hasPlayFn
      }) => __test(id, hasPlayFn), {
        id: \\"example-header--logged-in\\",
        hasPlayFn: false
      });
    });
  });
  describe(\\"Logged Out\\", () => {
    it(\\"test\\", async () => {
      page.on('pageerror', err => {
        page.evaluate(({
          id,
          err
        }) => __throwError(id, err), {
          id: \\"example-header--logged-out\\",
          err: err.message
        });
      });
      return page.evaluate(({
        id,
        hasPlayFn
      }) => __test(id, hasPlayFn), {
        id: \\"example-header--logged-out\\",
        hasPlayFn: false
      });
    });
  });
});",
  "example-page": "describe(\\"Example/Page\\", () => {
  describe(\\"Logged In\\", () => {
    it(\\"test\\", async () => {
      page.on('pageerror', err => {
        page.evaluate(({
          id,
          err
        }) => __throwError(id, err), {
          id: \\"example-page--logged-in\\",
          err: err.message
        });
      });
      return page.evaluate(({
        id,
        hasPlayFn
      }) => __test(id, hasPlayFn), {
        id: \\"example-page--logged-in\\",
        hasPlayFn: false
      });
    });
  });
});",
}
`);
  });

  it('should skip docs-only stories', () => {
    const input = dedent`{
      "v": 3,
      "stories": {
        "example-introduction--page": {
          "id": "example-introduction--page",
          "title": "Example/Introduction",
          "name": "Page",
          "importPath": "./stories/basic/Introduction.stories.mdx",
          "kind": "Example/Introduction",
          "story": "Page",
          "parameters": {
            "__id": "example-introduction--page",
            "docsOnly": true,
            "fileName": "./stories/basic/Introduction.stories.mdx"
          }
        },
        "example-page--logged-in": {
          "id": "example-page--logged-in",
          "title": "Example/Page",
          "name": "Logged In",
          "importPath": "./stories/basic/Page.stories.js",
          "kind": "Example/Page",
          "story": "Logged In",
          "parameters": {
            "__id": "example-page--logged-in",
            "docsOnly": false,
            "fileName": "./stories/basic/Page.stories.js"
          }
        }
      }
    }`;
    expect(transformPlaywrightJson(input)).toMatchInlineSnapshot(`
Object {
  "example-page": "describe(\\"Example/Page\\", () => {
  describe(\\"Logged In\\", () => {
    it(\\"test\\", async () => {
      page.on('pageerror', err => {
        page.evaluate(({
          id,
          err
        }) => __throwError(id, err), {
          id: \\"example-page--logged-in\\",
          err: err.message
        });
      });
      return page.evaluate(({
        id,
        hasPlayFn
      }) => __test(id, hasPlayFn), {
        id: \\"example-page--logged-in\\",
        hasPlayFn: false
      });
    });
  });
});",
}
`);
  });
});
