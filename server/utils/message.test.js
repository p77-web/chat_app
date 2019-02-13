const expect = require('expect');

let {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let from = 'Ioana';
    let text = 'A message';
    let message = generateMessage(from, text);

    expect(typeof message.completedAt).toBe('number');
    expect(message).toMatchObject({from, text});
  });
});
