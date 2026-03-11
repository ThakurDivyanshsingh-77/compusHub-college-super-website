const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const runSchema = async () => {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME || "campushub";

  // Step 1: Ensure database exists (no DB selected yet)
  const serverConnection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });

  try {
    await serverConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  } finally {
    await serverConnection.end();
  }

  // Step 2: Apply schema inside that database
  const schemaPath = path.join(__dirname, "schema.sql");
  let sql = fs.readFileSync(schemaPath, "utf8");

  // Remove CREATE DATABASE / USE lines from schema file, since we already handled DB selection
  sql = sql
    .split(/\r?\n/)
    .filter((line) => {
      const upper = line.trim().toUpperCase();
      return !upper.startsWith("CREATE DATABASE") && !upper.startsWith("USE ");
    })
    .join("\n");

  const dbConnection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
  });

  try {
    await dbConnection.query(sql);
    console.log("Database schema synced successfully.");
  } finally {
    await dbConnection.end();
  }
};

module.exports = runSchema;

