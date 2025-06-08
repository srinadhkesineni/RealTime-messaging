const assert = require('assert');

describe('Math operations', () => {
  it('should add numbers correctly', () => {
    assert.strictEqual(2 + 3, 5);
  });

  it('should subtract numbers correctly', () => {
    assert.strictEqual(10 - 4, 6);
  });

  it('should multiply numbers correctly', () => {
    assert.strictEqual(3 * 4, 12);
  });

  it('should divide numbers correctly', () => {
    assert.strictEqual(8 / 2, 4);
  });
});
