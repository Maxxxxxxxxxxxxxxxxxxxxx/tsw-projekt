import getSession from "../driver";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { _mapRecordsToObject } from "./util";
import log from "../../log";

const postSchema = z.object({
  postid: z.string(),
  content: z.string(),
  dateposted: z.number(),
});

/**
 * @param {string | undefined} id
 * Leave id blank for getting all
 */
export async function get(id) {
  const session = getSession();

  const res = id
    ? await session.run(
        `MATCH (p:Post { postid: $id })<-[:POSTED]-(u:User) RETURN p, u`,
        { id }
      )
    : await session.run(`MATCH (p:Post)<-[:POSTED]- RETURN p`);

  session.close();

  return _mapRecordsToObject(res.records);
}

/**
 * @param {string} id
 */
export async function getReplies(id) {
  const session = getSession();

  try {
    const res = await session.run(
      // `MATCH (p:Post { postid: $id })<-[:REPLIED_TO]-(subPost:Post) RETURN subPost`,
      `MATCH (p:Post { postid: $id })<-[:REPLIED_TO]-(subPost:Post)<-[:POSTED]-(u:User) RETURN subPost, u`,
      { id }
    );

    session.close();

    const mapped = _mapRecordsToObject(res.records);

    // @ts-ignore
    const result = mapped.map((obj) => {
      const { passwordHash, ...rest } = obj;
      return rest;
    });

    return result;
  } catch {
    return [];
  }
}

/** Saves post
 * @param {string} userid
 * @param {string} content
 */
export async function save(userid, content) {
  const session = getSession();
  const postid = uuid();
  const res = await session.run(
    `
    MATCH (u:User {userid: $userid})
    CREATE (p:Post { 
      postid: $postid, 
      content: $content,
      dateposted: $dateposted 
    })<-[:POSTED]-(u)
    RETURN p
    `,
    { userid, content, dateposted: Date.now(), postid }
  );

  session.close();

  const record = _mapRecordsToObject(res.records)[0];
  const parsedRecord = postSchema.parse(record);

  if (parsedRecord) {
    log.debug(`Created thread ${postid}`);
    return parsedRecord;
  }

  log.error("Failed to parse post object");
}

/** Deletes post
 * @param {string} postid
 */
export async function deletePost(postid) {
  const session = getSession();
  const res = await session.run(
    `MATCH (p:Post { postid: $postid }) DELETE p RETURN p`,
    { postid }
  );

  session.close();

  if (_mapRecordsToObject(res.records)) {
    log.debug(`Deleted post ${postid}`);
    return { message: `Post ${postid} deleted!` };
  }
}

/** Create a reply
 * @param {string} userid
 * @param {string} content
 * @param {string} opid
 */
export async function saveReply(userid, content, opid) {
  log.debug("call saveReply");

  const session = getSession();
  const postid = uuid();
  const res = await session.run(
    `
    MATCH (op:Post { postid: $opid })
    MATCH (u:User {userid: $userid})
    CREATE (op)<-[:REPLIED_TO]-(p:Post { 
      postid: $postid, 
      content: $content,
      dateposted: $dateposted 
    })<-[:POSTED]-(u)
    RETURN p
    `,
    { userid, content, dateposted: Date.now(), postid, opid }
  );

  session.close();

  const record = _mapRecordsToObject(res.records)[0];
  const parsedRecord = postSchema.parse(record);

  if (parsedRecord) {
    log.debug(`Saved reply ${postid} -> ${opid}`);
    return parsedRecord;
  }
}

/** Create a thread with citation
 * @param {string} userid
 * @param {string} content
 * @param {string} opid
 */
export async function citePost(userid, content, opid) {
  log.debug("call citePost");

  const session = getSession();
  const res = await session.run(
    `
    MATCH (op:Post { postid: $opid })
    MATCH (u:User {userid: $userid})
    CREATE (op)<-[:CITES]-(p:Post { 
      postid: $postid, 
      content: $content,
      dateposted: $dateposted 
    })<-[:POSTED]-(u)
    RETURN p
    `,
    { userid, content, dateposted: Date.now(), postid: uuid(), opid }
  );

  session.close();

  const record = _mapRecordsToObject(res.records)[0];
  const parsedRecord = postSchema.parse(record);

  if (parsedRecord) {
    log.debug(`Created thread ${opid} citing ${opid}`);
    return parsedRecord;
  }
}

/** Create a reply with citation
 * @param {string} userid
 * @param {string} content
 * @param {string} opid
 * @param {string} citid
 */
export async function saveReplyWithCitation(userid, content, opid, citid) {
  log.debug("call saveReplyWithCitation");

  const session = getSession();
  const res = await session.run(
    `
    MATCH (op:Post { postid: $opid })
    MATCH (citation:Post { postid: $citid })
    MATCH (u:User {userid: $userid})
    CREATE (op)<-[:REPLIED_TO]-(p:Post { 
      postid: $postid, 
      content: $content,
      dateposted: $dateposted 
    })<-[:POSTED]-(u)
    CREATE (citation)<-[:CITES]-(p)
    RETURN p
    `,
    { userid, content, dateposted: Date.now(), postid: uuid(), opid, citid }
  );

  session.close();

  log.debug(res.records);

  const record = _mapRecordsToObject(res.records)[0];
  const parsedRecord = postSchema.parse(record);

  if (parsedRecord) {
    log.debug(`Created reply ${opid} -> ${opid}, citing ${citid}`);
    return parsedRecord;
  }
}

/** Gets all thread-starter posts (only those that aren't replies) */
export async function getThreads() {
  const session = getSession();
  const res = await session.run(`
    MATCH (p:Post)
    MATCH (u:User)
    WHERE NOT (p)-[:REPLIED_TO]->()
    MATCH (p)<-[:POSTED]-(u)
    RETURN p, u;
  `);

  session.close();

  return _mapRecordsToObject(res.records);
}

/** Gets all thread-starter posts (only those that aren't replies)
 * @param {string} id Requester's id
 */
export async function getThreadsFollowed(id) {
  const session = getSession();
  const res = await session.run(
    `
    match (p:Post)
    match (u:User { userid: $id})
    match (followed:User)<-[r:FOLLOWS]-(u)
    where (p)<-[:POSTED]-(followed) AND NOT (p)-[:REPLIED_TO]->()
    return p, followed
  `,
    { id }
  );

  session.close();

  return _mapRecordsToObject(res.records);
}

/**
 * @param {string} userid
 */
export async function getUserThreads(userid) {
  const session = getSession();
  const res = await session.run(
    `
    MATCH (p:Post)
    MATCH (u:User { userid: $userid })
    WHERE NOT (p)-[:REPLIED_TO]->()
    MATCH (p)<-[:POSTED]-(u)
    RETURN p, u;
  `,
    { userid }
  );

  session.close();

  return _mapRecordsToObject(res.records);
}

/**
 * @param {string} postid
 */
export async function getCited(postid) {
  const session = getSession();
  try {
    const res = await session.run(
      `
      MATCH (p:Post { postid: $postid})-[:CITES]->(cited:Post)<-[:POSTED]-(u)
      RETURN cited, u
    `,
      { postid }
    );

    session.close();

    return _mapRecordsToObject(res.records);
  } catch (e) {
    log.error(e);
    return [];
  } finally {
    session.close();
  }
}
