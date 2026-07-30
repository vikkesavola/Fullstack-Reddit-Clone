import postgres from "postgres";

// In production (Deno Deploy) a single DATABASE_URL is provided by Neon and
// requires SSL. Locally (Docker Compose) no DATABASE_URL is set, so postgres()
// falls back to the standard PG* environment variables.
const connectionString = Deno.env.get("DATABASE_URL");

const sql = connectionString
  ? postgres(connectionString, { ssl: "require" })
  : postgres();

export default sql;
