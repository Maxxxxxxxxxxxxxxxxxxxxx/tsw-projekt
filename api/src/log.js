import log4js from "log4js";

const log = log4js.getLogger();
log.level = process.env.LOG_LEVEL || "info";

// log.info("Hello from Log4js-node", { name: "John", age: 21 });

export default log;
