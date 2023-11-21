import { Page } from 'playwright-core';
import {
  getStoryContext,
  setPreVisit,
  setPostVisit,
  TestRunnerConfig,
  waitForPageReady,
} from './hooks';

type MockPage = Page & { evaluate: jest.Mock };

describe('test-runner', () => {
  describe('setPreVisit', () => {
    it('sets the preVisit function', () => {
      const preVisit = jest.fn();
      setPreVisit(preVisit);
      expect(globalThis.__sbPreVisit).toBe(preVisit);
    });
  });

  describe('setPostVisit', () => {
    it('sets the postVisit function', () => {
      const postVisit = jest.fn();
      setPostVisit(postVisit);
      expect(globalThis.__sbPostVisit).toBe(postVisit);
    });
  });

  describe('getStoryContext', () => {
    const page = {
      evaluate: jest.fn(),
    } as MockPage;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('calls page.evaluate with the correct arguments', async () => {
      const context = { id: 'id', title: 'title', name: 'name' };
      await getStoryContext(page, context);
      expect(page.evaluate).toHaveBeenCalledWith(expect.any(Function), { storyId: context.id });
    });

    it('returns the result of page.evaluate', async () => {
      const context = { id: 'id', title: 'title', name: 'name' };
      const storyContext = { kind: 'kind', name: 'name' };
      page.evaluate.mockResolvedValueOnce(storyContext);
      const result = await getStoryContext(page, context);
      expect(result).toBe(storyContext);
    });

    it('calls globalThis.__getContext with the correct storyId', async () => {
      const context = { id: 'id', title: 'title', name: 'name' };
      const storyContext = { kind: 'kind', name: 'name' };

      // Mock globalThis.__getContext
      globalThis.__getContext = jest.fn();

      page.evaluate.mockImplementation(async (func) => {
        // Call the function passed to page.evaluate
        func({ storyId: context.id });
        return storyContext;
      });

      await getStoryContext(page, context);

      // Check that globalThis.__getContext was called with the correct storyId
      expect(globalThis.__getContext).toHaveBeenCalledWith(context.id);
    });
  });

  describe('TestRunnerConfig', () => {
    it('has the correct properties', () => {
      const config: TestRunnerConfig = {};
      expect(config).toMatchObject({});
    });
  });

  describe('waitForPageReady', () => {
    let page: Page;

    beforeEach(() => {
      page = {
        waitForLoadState: jest.fn(),
        evaluate: jest.fn(),
      } as unknown as Page;
    });

    it('waits for the page to be ready', async () => {
      await waitForPageReady(page);
      expect(page.waitForLoadState).toHaveBeenCalledWith('domcontentloaded');
      expect(page.waitForLoadState).toHaveBeenCalledWith('load');
      expect(page.waitForLoadState).toHaveBeenCalledWith('networkidle');
      expect(page.evaluate).toHaveBeenCalledWith(expect.any(Function));
    });

    it('calls page.evaluate with () => document.fonts.ready', async () => {
      const page = {
        waitForLoadState: jest.fn(),
        evaluate: jest.fn(),
      } as unknown as MockPage;

      // Mock document.fonts.ready
      globalThis.document = {
        fonts: {
          ready: 'ready',
        },
      } as unknown as Document;
      await waitForPageReady(page);

      expect(page.evaluate).toHaveBeenCalledWith(expect.any(Function));
      const evaluateFn = page.evaluate.mock.calls[0][0];
      const mockDocument = { fonts: { ready: 'ready' } };
      expect(evaluateFn(mockDocument)).toBe('ready');
    });
  });
});
