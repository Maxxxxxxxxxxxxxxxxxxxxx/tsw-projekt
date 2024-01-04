import { db } from "./db";

db.model("Person", {
  person_id: {
    primary: true,
    type: "uuid",
    required: true, // Creates an Exists Constraint in Enterprise mode
  },
  payroll: {
    type: "number",
    unique: "true", // Creates a Unique Constraint
  },
  name: {
    type: "name",
    index: true, // Creates an Index
  },
  age: "number", // Simple schema definition of property : type
});

db.model("Account", {
    id: {
      primary: true,
      type: "uuid",
      required: true,
    },
    hash: {
      type: "string",
      required: true,
    },
    name: {
      type: "name",
      index: true, // Creates an Index
    },
    age: "number", // Simple schema definition of property : type
  });