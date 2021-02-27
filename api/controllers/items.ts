import { Request, Response } from 'express'

export default function() {
    return {
        async createItem (req: Request, res: Response) {
            try {
                return res.sendStatus(201);        
            } catch (err) {
                console.log(err);
                return res.sendStatus(500);
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
                return res.status(200).send({
                    item1: "cap1",
                    item2: "cap2",
                    item3: "cap3",
                    item4: "cap4",
                    item5: "cap5",
                    item6: "cap6"
                })
            } catch (err) {
                console.log(err);
                return res.sendStatus(500);
            }
        },
        async getItemById (req: Request, res: Response) {
            try {
                if (req.enforcer.params.id === '1') {
                    return res.status(200).send({item1: 'cap1'});
                }
                return res.status(404).send();
            } catch (err) {
                console.log(err);
                return res.sendStatus(500);
            }
        },
        async deleteItem (req: Request, res: Response) {
            try {
                if (req.enforcer.params.id === '1') {
                    return res.sendStatus(200);
                }
                return res.sendStatus(404);
            } catch (err) {
                console.log(err);
                return res.sendStatus(500);
            }
        },
        async updateItem (req: Request, res: Response) {
            try {
                if (req.enforcer.params.id === '1') {
                    return res.status(200).send({message: "updated"});
                }
                else {
                    return res.sendStatus(404);
                }
            } catch (err) {
                console.log(err);
                return res.sendStatus(500);
            }
        }
    }
}






