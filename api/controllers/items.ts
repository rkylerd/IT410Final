import { Request, Response } from 'express'
import Error from '../models/Error'

export default function (
    { verifyToken } : { verifyToken: Function, generateToken: Function }, 
    mongoose: any
) {
    const itemSchema = new mongoose.Schema({
        _id: Number,
        name: String,
        price: Number,
        category: String,
        description: String,
        imageUrl: String,
        stock: Number,
        sizes: [],
        promotionalFlag: Boolean, 
        promotionalPrice: Number
    });

    const Item = mongoose.model('Item', itemSchema);

    return {
        async addItem (req: Request, res: Response) {
            try {
                const newItem = new Item({
                        ...req.enforcer.body
                    });
                await newItem.save();
                res.sendStatus(201);
            } catch(err) {
                console.log('ERROR---addItem', err);
                res.sendStatus(500);
            }
        },
        async uploadImage (req: Request, res: Response) {
            try {
                return res.status(200).send({message: "file uploaded"});
            } catch (err) {
                console.log(err);
                return res.sendStatus(500);
            }
        },
        async getItems (req: Request, res: Response) {
            try {
                res.status(200).send(await Item.find());
            } catch(err) {
                console.log('ERROR---getItems', err);
                res.sendStatus(500);
            }
        },
        async getItemById (req: Request, res: Response) {
            try {
                const itemId = req.enforcer.params.itemId;
                const item = await Item.findOne({_id: itemId});
                if (item) {
                    res.status(200).send(item);
                }
                res.status(404).send(new Error(`Item with id '${itemId}' not found.`, 404));
            } catch(err) {
                console.log('ERROR---getItemById', err);
                res.sendStatus(500);
            }
        },
        async deleteItem (req: Request, res: Response) {
            try {
                const itemId = req.enforcer.params.itemId;
                await Item.deleteOne({_id: itemId});
                res.sendStatus(204);
            } catch(err) {
                console.log('ERROR---deleteItem', err);
                res.sendStatus(500);
            }
        },
        async updateItem (req: Request, res: Response) {
            try {
                const itemId = req.enforcer.params.itemId;

                // ensure that client isn't injecting other attributes
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
                const fieldsToUpdate = {name, price, category, description, imageUrl, stock, sizes, promotionalFlag, promotionalPrice};
                
                let item = await Item.findOne({_id: itemId});
                if (!item) {
                    res.status(404).send(new Error(`Item with id '${itemId}' not found.`, 404));
                }

                Object.entries(fieldsToUpdate).forEach(([k,v]) => {
                    if (v) {
                        // @ts-ignore
                        item[k] = v;
                    }
                });

                item.save();
                res.sendStatus(204);
            } catch(err) {
                console.log('ERROR---updateItem', err);
                res.sendStatus(500);
            }
        }
    }
}






