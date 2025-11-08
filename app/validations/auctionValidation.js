import Joi from "joi";

export const auctionSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required(),
    description: Joi.string()
        .max(255)
        .optional(),
    start_price: Joi.number()
        .positive()
        .required(),
});
