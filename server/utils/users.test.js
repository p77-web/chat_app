const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Ioana',
        room: 'Javascript'
      },
      {
        id: '2',
        name: 'Paul',
        room: 'Java'
      },
      {
        id: '3',
        name: 'Geta',
        room: 'Javascript'
      }
    ]
  });

  it('should add new user', () => {
    let users = new Users();
    let user = {
      id: '555',
      name: 'Ioana',
      room: 'Room A'
    };
    let resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    let userId = '1';
    let user = users.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    let userId = '77';
    let user = users.removeUser(userId);

    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    let userId = '2';
    let user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    let userId = '77';
    let user = users.getUser(userId);

    expect(user).toBeFalsy();
  });

  it('should return names for javascript', () => {
    let userList = users.getUserList('Javascript');

    expect(userList).toEqual(['Ioana', 'Geta']);
  });

  it('should return names for java', () => {
    let userList = users.getUserList('Java');

    expect(userList).toEqual(['Paul']);
  });
});
