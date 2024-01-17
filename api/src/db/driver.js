import neo4j from "neo4j-driver";

// Neo4j connection details
const uri = `bolt://${process.env.NEO4J_HOST}:${process.env.NEO4J_PORT}`;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

// @ts-ignore
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const getSession = () => driver.session();

export default getSession;
