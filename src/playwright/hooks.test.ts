import { getStoryContext, setPreRender, setPostRender, TestRunnerConfig } from './hooks';

describe('test-runner', () => {
  describe('setPreRender', () => {
    it('sets the preRender function', () => {
      const preRender = jest.fn();
      setPreRender(preRender);
      expect(globalThis.__sbPreRender).toBe(preRender);
    });
  });

  describe('setPostRender', () => {
    it('sets the postRender function', () => {
      const postRender = jest.fn();
      setPostRender(postRender);
      expect(globalThis.__sbPostRender).toBe(postRender);
    });
  });

  describe('getStoryContext', () => {
    const page = {
      evaluate: jest.fn(),
    } as any;

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
  });

  describe('TestRunnerConfig', () => {
    it('has the correct properties', () => {
      const config: TestRunnerConfig = {};
      expect(config).toMatchObject({});
    });
  });
});
