require("dotenv").config({ path: ".env" });

const { createClient } = require("@libsql/client");

async function main() {
  const db = createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const result = await db.execute(`
    select 
      id,
      customer_id,
      total_cents,
      payment_status,
      order_status,
      order_date,
      created_time
    from orders
    order by created_time desc
    limit 5
  `);

  console.log(result.rows);
}

main().catch(console.error);