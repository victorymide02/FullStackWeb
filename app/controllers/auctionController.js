import * as model from ".app/models/auctionModel.js";
import { auctionSchema } from ".app/validation/auctionValidation.js";

export async function getAllAuctions(req, res, next) {
    try {
        const auctions = await model.getAll();
        res.json(auctions);
    } catch (err) {
        next(err);
    }
}

export async function createAuction(req, res, next) {
    try {
        const { error, value } = auctionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const newAuction = await model.create(value);
        res.status(201).json(newAuction);
    } catch (err) {
        next(err);
    }
}
