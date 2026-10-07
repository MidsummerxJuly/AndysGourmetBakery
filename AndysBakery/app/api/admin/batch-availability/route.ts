import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const client = await pool.connect();

  try {
    const batchResult = await client.query(
      "SELECT * FROM inventory_batches WHERE is_current = true LIMIT 1"
    );

    let batch;

    if (batchResult.rows.length === 0) {
      const batchId = randomUUID();

      const insertResult = await client.query(
        "INSERT INTO inventory_batches (id, name, status, is_current) VALUES ($1, $2, $3, $4) RETURNING *",
        [batchId, "Current Batch", "draft", true]
      );

      batch = insertResult.rows[0];
    } else {
      batch = batchResult.rows[0];
    }

    const availabilityResult = await client.query(
      `
      SELECT
        mis.id AS menu_item_size_id,
        mi.id AS menu_item_id,
        mi.name AS item_name,
        s.id AS size_id,
        s.name AS size_name,
        mis.price_cents,
        ba.id AS batch_availability_id,
        COALESCE(ba.quantity_available, 0) AS quantity_available,
        COALESCE(ba.made_this_batch, false) AS made_this_batch

      FROM menu_item_sizes mis

      JOIN menu_items mi
        ON mi.id = mis.menu_item_id

      JOIN sizes s
        ON s.id = mis.size_id

      LEFT JOIN batch_availability ba
        ON ba.menu_item_size_id = mis.id
        AND ba.batch_id = $1

      ORDER BY mi.name ASC, s.id ASC
      `,
      [batch.id]
    );

    return NextResponse.json({
      ok: true,
      batch,
      items: availabilityResult.rows,
    });
  } finally {
    client.release();
  }
}

export async function PATCH(request: Request) {
  const client = await pool.connect();

  try {
    const data = await request.json();

    if (!Array.isArray(data.items)) {
      return NextResponse.json(
        { ok: false, error: "items must be an array" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const batchResult = await client.query(
      "SELECT * FROM inventory_batches WHERE is_current = true LIMIT 1"
    );

    let batch;

    if (batchResult.rows.length === 0) {
      const batchId = randomUUID();

      const insertResult = await client.query(
        "INSERT INTO inventory_batches (id, name, status, is_current) VALUES ($1, $2, $3, $4) RETURNING *",
        [batchId, "Current Batch", "draft", true]
      );

      batch = insertResult.rows[0];
    } else {
      batch = batchResult.rows[0];
    }

    for (const item of data.items) {
      const availabilityId = randomUUID();

      const madeThisBatch = Boolean(item.made_this_batch);

      const quantityAvailable = madeThisBatch
        ? Math.max(0, Math.floor(Number(item.quantity_available) || 0))
        : 0;

      await client.query(
        `
        INSERT INTO batch_availability (
          id,
          batch_id,
          menu_item_size_id,
          made_this_batch,
          quantity_available
        )
        VALUES ($1, $2, $3, $4, $5)

        ON CONFLICT (batch_id, menu_item_size_id)

        DO UPDATE SET
          made_this_batch = EXCLUDED.made_this_batch,
          quantity_available = EXCLUDED.quantity_available,
          updated_at = NOW()
        `,
        [
          availabilityId,
          batch.id,
          item.menu_item_size_id,
          madeThisBatch,
          quantityAvailable,
        ]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      ok: true,
      batch,
      updatedCount: data.items.length,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Failed to update batch availability:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to update batch availability",
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
/*  What the file does basically 

    Use NextResponse so the route can send JSON.
    Use Pool so the route can talk to PostgreSQL.
    Create a pool from the database URL.
    When GET runs, borrow a database connection.
    Return test JSON.
    Always release the connection afterward.


    SELECT current_database() AS database_name asks PostgreSQL for the name of the database currently connected to. 
    current_database() is a built-in PostgreSQL function. 
    AS database_name does not change the database or URL; it just labels the returned value so JavaScript can access it more clearly.

    client.query(...) returns a result object.
    The actual data is inside result.rows.
    Because this query only returns one row, I use result.rows[0].
    Then .database_name gets the value from the column label I created with AS database_name.


*/


/*Possible pieces of code pre written


*/