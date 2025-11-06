import { open } from "sqlite";
import sqlite3 from "sqlite3";

export const dbPromise = open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
});

export async function initDB() {
    const db = await dbPromise;
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        );
    `);
}

export async function findUserByEmail(email) {
    const db = await dbPromise;
    return db.get("SELECT * FROM users WHERE email = ?", [email]);
}

export async function createUser(email, hash) {
    const db = await dbPromise;
    const result = await db.run(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)",
        [email, hash]
    );
    return { id: result.lastID, email };
}
