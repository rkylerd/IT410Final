import { Request, Response } from 'express'
const orders = [
    {
        "id": "1",
        "price": 23.90,
        "dateCreated": "now()",
        "inPersonPickUp": false,
        "expectedArrivalDate": "tomorrow",
        "label": "...",
        "trackingId": "789789",
        "items": [
            {
                "qty": 1,
                "size": "xxl",
                "otheritemsinfo": {}
            }
        ],
        "status": "string",
        "address": {
            "street1": "786 nubt lane",
            "street2":"",
            "city": "provo",
            "state": "az",
            "zip": "89122"
        },
        "userId": "234324"
    }
];

export default function () {
  return {
    async createOrder (req: Request, res: Response) {
        orders.push(req.body);
        res.sendStatus(200);
    },
    async getOrders (req: Request, res: Response) {
        res.status(200).send(orders);
    },
    async getOrderById (req: Request, res: Response) {
        console.log('req', req);
        const orderId = req.enforcer.params.orderId || 2;
        const order = orders.find(({id = ""}) => {
            console.log(id, orderId);
            return id === `${orderId}`
        });
        res.status(order ? 200 : 404).send(
            order
        );
    },
    async deleteOrder (req: Request, res: Response) {
        res.status(204).send();
    },
  }
}

