import sqlite3 from "sqlite3";
import path from "path";

sqlite3.verbose();

const dbPath = path.join(__dirname, "../../database.sqlite");

export const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error("Database connection error:", error.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});