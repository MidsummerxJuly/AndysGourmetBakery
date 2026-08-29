require("dotenv").config({ path: ".env" });

const { createClient } = require("@libsql/client");

async function main() {
  console.log("URL loaded:", !!process.env.TURSO_CONNECTION_URL);
  console.log("TOKEN loaded:", !!process.env.TURSO_AUTH_TOKEN);

  const db = createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const result = await db.execute(
    "select name from sqlite_master where type='table' order by name"
  );

  console.log("Tables:");
  console.log(result.rows);
}

main().catch(console.error);