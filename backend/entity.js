let users = [];

const addUsers = ({ id, name, room }) => {
  if (!name || !room) {
    return { error: "Name and room is required" };
  }
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (users.length) {
    const existingUser = users.find(
      (each) => each.name === name && each.room === room
    );
    if (existingUser) {
      return { error: "user already exist" };
    }
  }
  const user = { id, name, room };

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const findId = users.findIndex((each) => each.id == id);

  if (findId >= 0) {
    return users.splice(findId, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((each) => each.id == id);
};

const getUserInRoom = (room) => {
  return users.filter((each) => each.room == room);
};

module.exports = { addUsers, removeUser, getUser, getUserInRoom };
