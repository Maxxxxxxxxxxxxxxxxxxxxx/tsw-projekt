import crypto from "node:crypto";

/**
 * @param {crypto.BinaryLike} password
 */
export default function hash(password) {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  const hashedPassword = hash.digest("hex");
  return hashedPassword;
}
