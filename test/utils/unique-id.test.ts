import uniqueid from '../../utils/unique-id';

describe('Utils unique-id', () => {
  it('Expect respect the pattern', async () => {
    expect(uniqueid()).toEqual(expect.stringMatching(/[a-z0-9]{16}/));
  });
});
