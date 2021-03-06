import { Request, Response } from 'express'
import Error from '../models/Error'

export default function(auth:any, mongoose:any) {
    const itemSchema = new mongoose.Schema({
        name: String,
        price: Number,
        category: String,
        description: String, 
        imageUrl: String,
        stock: String,
        sizes: [],
        promotionalFlag: Boolean,
        promotionalPrice: Number
    });
    const Item = mongoose.model('Item', itemSchema);
    return {
        async createItem (req: Request, res: Response) {
            try {
                const newItem = new Item({
                        ...req.enforcer.body
                    });
                await newItem.save();
                res.status(201).send(newItem);
            } catch(err) {
                console.log('ERROR---createItem', err);
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
                const updatedItem = {...req.enforcer.body, _id: req.enforcer.params.itemId };
                
                const item = await Item.findOne({_id: itemId});
                if (item) {
                    item
                    res.status(200).send(item);

                }
                res.status(404).send(new Error(`Item with id '${itemId}' not found.`, 404));
            } catch(err) {
                console.log('ERROR---getItemById', err);
                res.sendStatus(500);
            }
        }
    }
}






