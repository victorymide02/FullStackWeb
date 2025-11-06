import { dbPromise } from "./db.js";

export async function getAll() {
    const db = await dbPromise;
    return db.all("SELECT * FROM auctions");
}

export async function create(auction) {
    const db = await dbPromise;
    const { title, description, start_price } = auction;
    const result = await db.run(
        "INSERT INTO auctions (title, description, start_price) VALUES (?, ?, ?)",
        [title, description, start_price]
    );
    return { id: result.lastID, ...auction };
}
