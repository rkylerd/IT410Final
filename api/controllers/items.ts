import { Request, Response } from 'express'
import Error from '../models/Error'

export default function (
    mongoItemSchema: any,
    { isTokenValid }: { isTokenValid: Function },
    mongoose: any
) {
    const Item = mongoItemSchema(mongoose);

    return {
        async addItem(req: Request, res: Response) {
            if (await isTokenValid(req, res, undefined, true)) {
                try {
                    const newItem = new Item({
                        ...req.enforcer.body
                    });
                    await newItem.save();
                    res.sendStatus(201);
                } catch (err) {
                    console.log('ERROR---addItem', err);
                    res.sendStatus(500);
                }
            }
        },
        async uploadImage(req: Request, res: Response) {
            if (await isTokenValid(req, res, undefined, true)) {
                try {
                    return res.status(200).send({ message: "file uploaded" });
                } catch (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
            }
        },
        async getItems(req: Request, res: Response) {
            const { category = "" } = req.enforcer.query;
            try {
                res.status(200).send(category ?
                    // will not work correctly if there are spaces surrounding the pipe symbol
                    await Item.find({ category: { $in: category.split("|") } }) :
                    await Item.find()
                );
            } catch (err) {
                console.log('ERROR---getItems', err);
                res.sendStatus(500);
            }
        },
        async getItemById(req: Request, res: Response) {
            try {
                const itemId = req.enforcer.params.itemId;
                const item = await Item.findOne({ _id: itemId });
                if (item) {
                    res.status(200).send(item);
                }
                res.status(404).send(new Error(`Item with id '${itemId}' not found.`, 404));
            } catch (err) {
                console.log('ERROR---getItemById', err);
                res.sendStatus(500);
            }

        },
        async deleteItem(req: Request, res: Response) {
            if (await isTokenValid(req, res, undefined, true)) {
                try {
                    const itemId = req.enforcer.params.itemId;
                    await Item.deleteOne({ _id: itemId });
                    res.sendStatus(204);
                } catch (err) {
                    console.log('ERROR---deleteItem', err);
                    res.sendStatus(500);
                }
            }
        },
        async updateItem(req: Request, res: Response) {
            if (await isTokenValid(req, res, undefined, true)) {
                try {
                    const itemId = req.enforcer.params.itemId;

                    // ensure that client can only update the following attributes
                    const {
                        name,
                        price,
                        category,
                        description,
                        imageUrl,
                        stock,
                        sizes,
                        promotionalFlag,
                        promotionalPrice
                    } = req.enforcer.body;
                    const fieldsToUpdate = { name, price, category, description, imageUrl, stock, sizes, promotionalFlag, promotionalPrice };

                    let item = await Item.findOne({ _id: itemId });
                    if (!item) {
                        res.status(404).send(new Error(`Item with id '${itemId}' not found.`, 404));
                    }

                    Object.entries(fieldsToUpdate).forEach(([k, v]) => {
                        if (v) {
                            // @ts-ignore
                            item[k] = v;
                        }
                    });

                    item.save();
                    res.sendStatus(204);
                } catch (err) {
                    console.log('ERROR---updateItem', err);
                    res.sendStatus(500);
                }
            }
        }
    }
}






