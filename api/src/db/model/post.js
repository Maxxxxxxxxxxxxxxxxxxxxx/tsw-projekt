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
    ? await session.run(`MATCH (p:Post { postid: $id }) RETURN p`, { id })
    : await session.run(`MATCH (p:Post) RETURN p`);

  return _mapRecordsToObject(res.records);
}

/**
 * @param {string} id
 */
export async function getReplies(id) {
  const session = getSession();

  const res = await session.run(
    `MATCH (p:Post { postid: $id })<-[:REPLIED_TO]-(subPost:Post) RETURN subPost`,
    { id }
  );

  return _mapRecordsToObject(res.records);
}

/** Saves post
 * @param {string} userid
 * @param {string} content
 */
export async function save(userid, content) {
  const session = getSession();
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
    { userid, content, dateposted: Date.now(), postid: uuid() }
  );

  session.close();

  const record = _mapRecordsToObject(res.records)[0];
  const parsedRecord = postSchema.parse(record);

  if (parsedRecord) {
    log.debug("Created post", parsedRecord);
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

  if (_mapRecordsToObject(res.records)) {
    return { message: `Post ${postid} deleted!` };
  }

  session.close();
}

/** Create a reply
 * @param {string} userid
 * @param {string} content
 * @param {string} opid
 */
export async function saveReply(userid, content, opid) {
  const session = getSession();
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
    { userid, content, dateposted: Date.now(), postid: uuid(), opid }
  );

  const record = _mapRecordsToObject(res.records);
  const parsedRecord = postSchema.parse(record);

  if (parsedRecord) {
    return parsedRecord;
  }
}

/** Create a thread with citation
 * @param {string} userid
 * @param {string} content
 * @param {string} opid
 */
export async function citePost(userid, content, opid) {
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

  const record = _mapRecordsToObject(res.records);
  const parsedRecord = postSchema.parse(record);

  if (parsedRecord) {
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
  const session = getSession();
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
    { userid, content, dateposted: Date.now(), postid: uuid(), opid }
  );

  const res2 = await session.run(``);

  const record = _mapRecordsToObject(res.records);
  const parsedRecord = postSchema.parse(record);

  if (parsedRecord) {
    return parsedRecord;
  }
}

/** Gets all thread-starter posts (only those that aren't replies) */
export async function getThreads() {
  const session = getSession();
  const res = await session.run(`
    MATCH (p:Post)
    MATCH (u:User)
    OPTIONAL MATCH (op:Post)<-[:REPLIED_TO]-(p)
    WHERE op IS NULL
    MATCH (p)<-[:POSTED]-(u)
    RETURN p, u.userid, u.username ORDER BY p.dateposted;
  `);

  return _mapRecordsToObject(res.records);
}
