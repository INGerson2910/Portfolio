import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { pool } from "./pool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, "schema.sql"), "utf8");

await pool.query(sql);
console.log("Schema applied successfully");
await pool.end();
