import getSession from "../driver";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { _mapRecordsToObject } from "./util";

const postSchema = z.object({
  postid: z.string(),
  content: z.string(),
  dateposted: z.date(),
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

/**
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

  const record = _mapRecordsToObject(res.records);
  const parsedRecord = postSchema.parse(record);

  if (parsedRecord) {
    return parsedRecord;
  }
}

/**
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
}

/**
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
