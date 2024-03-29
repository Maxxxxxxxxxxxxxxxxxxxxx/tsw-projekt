import hash from "../../auth/hash";
import getSession from "../driver";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { _mapRecordsToObject } from "./util";
import log from "../../log";

const schema = z.object({
  username: z.string(),
  passwordHash: z.string(),
  userid: z.string().uuid(),
  bio: z.string().nullable(),
  image: z.string().nullable(),
});

export async function getAll() {
  const session = getSession();
  const res = await session.run(
    `
    MATCH (user:User)
    RETURN user;
    `
  );

  session.close();

  // @ts-ignore
  return _mapRecordsToObject(res.records);
}

/**
 * @param {string} id
 */
export async function get(id) {
  const session = getSession();
  const res = await session.run(
    `
    MATCH (user:User { userid: $id})
    RETURN user;
    `,
    { id }
  );

  session.close();

  // @ts-ignore
  return _mapRecordsToObject(res.records);
}

/**
 * @param {string} username
 */
export async function getByUsername(username) {
  const session = getSession();
  const res = await session.run(
    `
    MATCH (user:User { username: $username})
    RETURN user;
    `,
    { username }
  );

  session.close();

  // @ts-ignore
  return _mapRecordsToObject(res.records);
}

/**
 * @param {string} username
 * @param {string} password
 */
export async function save(username, password) {
  const session = getSession();

  if (!username || !password) {
    log.error("Tried to create user with blank username/password");
    throw "Username/password cannot be blank!";
  }

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
        CREATE (user:User {
          username: $username, 
          passwordHash: $passwordHash, 
          userid: $userid,
          bio: \"\",
          image: \"\"
        })
        RETURN user;
        `,
      { username, passwordHash: hash(password), userid: uuid() }
    );

    log.debug(`Created user { username: ${username} }`);

    return _mapRecordsToObject(createdUser.records);
  }

  session.close();
}

/**
 * @param {string} id
 */
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
    console.log(`User ${id} not found!`);
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

/**
 * @param {string} id
 * @param {string} newBio
 */
export async function updateBio(id, newBio) {
  const session = getSession();
  const res = await session.run(
    `
      MATCH (user:User {userid: $id})
      RETURN user;
      `,
    { id }
  );

  if (res.records.length != 0) {
    const updatedRes = await session.run(
      `
      MATCH (user:User {userid: $id})
      SET user.bio = $newBio
      RETURN user
      `,
      { id, newBio }
    );

    return _mapRecordsToObject(updatedRes.records);
  }

  session.close();
}

/**
 * @param {string} id
 * @param {string} image
 */
export async function updateImage(id, image) {
  const session = getSession();
  const res = await session.run(
    `
      MATCH (user:User {userid: $id})
      RETURN user;
      `,
    { id }
  );

  if (res.records.length != 0) {
    const updatedRes = await session.run(
      `
      MATCH (user:User {userid: $id})
      SET user.image = $image
      RETURN user
      `,
      { id, image }
    );

    return _mapRecordsToObject(updatedRes.records);
  }

  session.close();
}

/**
 * @param {string} followerId
 * @param {string} followedId
 */
export async function followUser(followerId, followedId) {
  const session = getSession();

  await session.run(
    `
      MATCH (followed:User { userid: $followedId })
      MATCH (follower:User { userid: $followerId })
      CREATE (follower)-[:FOLLOWS]->(followed)
      `
  );

  return { message: `User ${followedId} followed` };
}

/**
 * @param {string} userid
 */
export async function getFollowers(userid) {
  const session = getSession();
  const res = await session.run(
    `
  MATCH (u:User { userid: $userid})<-[:FOLLOWS]-(f:User) return f
  `,
    { userid }
  );

  session.close();

  const records = _mapRecordsToObject(res.records);

  try {
    // @ts-ignore
    const res = records.map((record) => schema.parse(record));
    return res;
  } catch (e) {
    log.error(`Failed to parse user schema {getFollowers}`);
    return;
  }
}

/**
 * @param {string} followerId
 * @param {string} followedId
 */
export async function follow(followerId, followedId) {
  const session = getSession();

  try {
    const res = await session.run(
      `
      MATCH (u:User { userid: $followerId})
      MATCH (f:User { userid: $followedId})
      CREATE (u)-[r:FOLLOWS]->(f)
      SET r.timestamp = timestamp()
      RETURN f
      `,
      { followerId, followedId }
    );

    return true;
  } catch (e) {
    log.error(e);
    return false;
  } finally {
    session.close();
  }
}

/**
 * @param {string} followerId
 * @param {string} followedId
 */
export async function unfollow(followerId, followedId) {
  const session = getSession();

  try {
    const res = await session.run(
      `
      MATCH (u:User { userid: $followerId})
      MATCH (f:User { userid: $followedId})
      MATCH (u)-[r:FOLLOWS]->(f)
      DELETE r
      `,
      { followerId, followedId }
    );

    return true;
  } catch (e) {
    log.error(e);
    return false;
  } finally {
    session.close();
  }
}

/**
 *
 * @param {string} id User's id
 */
export async function getFollowed(id) {
  const session = getSession();
  try {
    const res = await session.run(
      `
      MATCH (u:User { userid: $id })-[:FOLLOWS]->(followed:User)
      RETURN followed
    `,
      { id }
    );

    return _mapRecordsToObject(res.records);
  } catch (e) {
    log.error(e);
    return [];
  }
}
