import { PostExtractTokenToGetIdMiddleware } from './post.extract-token-to-get-id.middleware';

describe('PostExtractTokenToGetIdMiddleware', () => {
  it('should be defined', () => {
    expect(new PostExtractTokenToGetIdMiddleware()).toBeDefined();
  });
});
