import config from "@/lib/config";
import { Pool } from "pg"

// const {env: { localDatabaseUrl }}  = config;
// const poolDB = new Pool({
//   connectionString: localDatabaseUrl
// });
const {env: { cloudDatabaseUrl }}  = config;
const poolDB = new Pool({
  // connectionString: localDatabaseUrl, Local DB
  connectionString: cloudDatabaseUrl, //Neon(cloud) DB
  ssl: { rejectUnauthorized: false }, // required for Neon
});

export default poolDB;

/*
In Node.js PostgreSQL libraries like pg, you usually have:

pool.query() — when you use a connection pool (recommended for most apps)
db.query() — if your db is a single client instance, or if you wrapped the pool in a custom db object.


Typically, pool.query() is BETTER for most server applications because:

Connection pooling:
It automatically manages multiple connections to the database. Every query pulls a free connection from the pool instead of opening a new one every time.

Performance:
Reusing connections reduces the overhead of creating/tearing down TCP connections to your database. Faster queries, especially under load.

Error handling:
The pool will handle dead connections and reconnect automatically.

Scaling:
If your app grows (more traffic), pooling is critical to avoid bottlenecking your database.

*/ 
