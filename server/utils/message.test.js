const expect = require('expect');

let {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let from = 'Ioana';
    let text = 'A message';
    let message = generateMessage(from, text);

    expect(typeof message.completedAt).toBe('number');
    expect(message).toMatchObject({from, text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    let from = 'Paul';
    let latitude = 20;
    let longitude = 30;
    let url = 'https://www.google.com/maps?q=20,30';
    let message = generateLocationMessage(from, latitude, longitude);

    expect(typeof message.completedAt).toBe('number');
    expect(message).toMatchObject({from, url});
  });
});
