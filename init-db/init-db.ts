import { Client } from 'pg';
import * as fs from 'fs';

async function executeSQL() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: 5432,
    ssl: process.env.PRODUCTION === 'true',
  });

  try {
    await client.connect();
    const sql = fs.readFileSync('./init-db/init-db.sql', 'utf8');
    await client.query(sql);
    console.log('SQL script executed successfully');
  } catch (err) {
    console.error('Error executing SQL script:', err);
  } finally {
    await client.end();
  }
}

executeSQL();
