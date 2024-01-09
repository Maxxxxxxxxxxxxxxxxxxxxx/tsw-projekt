import hash from "../../auth/hash";
import getSession from "../driver";
import { v4 as uuid } from "uuid";

export async function getAll() {
  const session = getSession();
  const res = await session.run(
    `
    MATCH (user:User)
    RETURN user;
    `
  );

  return res.records.map((e) => e._fields[0].properties);
}

export async function get(id) {
  const session = getSession();
  const res = await session.run(
    `
    MATCH (user:User { userid: $id})
    RETURN user;
    `,
    { userid: id }
  );

  return res.records.map((e) => e._fields[0].properties);
}

export async function getByUsername(username) {
  const session = getSession();
  const res = await session.run(
    `
    MATCH (user:User { username: $username})
    RETURN user;
    `,
    { username }
  );

  return res.records.map((e) => e._fields[0].properties);
}

export async function save(username, password) {
  const session = getSession();
  const res = await session.run(
    `
      MATCH (user:User {username: $username})
      RETURN user;
      `,
    { username }
  );

  if (res.records.length != 0) {
    console.log(`User ${username} already exists!`);
  } else {
    const createdUser = await session.run(
      `
        CREATE (user:User {username: $username, passwordHash: $passwordHash, userid: $userid})
        RETURN user;
        `,
      { username, passwordHash: hash(password), userid: uuid() }
    );

    return createdUser.records[0];
  }

  session.close();
}

export async function deleteById(id) {
  const session = getSession();
  const res = await session.run(
    `
      MATCH (user:User {userid: $userid})
      RETURN user;
      `,
    { userid: id }
  );

  if (res.records.length != 0) {
    console.log(`User ${username} not found!`);
  } else {
    await session.run(
      `
        MATCH (user:User {userid: $userid})
        DELETE user;
        `,
      { userid: id }
    );

    return id;
  }

  session.close();
}
