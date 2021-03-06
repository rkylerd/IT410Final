import { Request, Response } from 'express'
import Error from '../models/Error'

export default function (auth:any, mongoose:any) {
    const orderSchema = new mongoose.Schema({
        price: Number,
        dateCreated: String,
        inPersonPickup: Boolean,
        expectedArrivalDate: String,
        label: String,
        trackingId: String,
        items: Array,
        status: String,
        address: Object,
        userid: String
    });

    const Order = mongoose.model('Order', orderSchema);
  return {
    async createOrder (req: Request, res: Response) {
        try {
            const newOrder = new Order({
                    ...req.enforcer.body
                });
            await newOrder.save();
            res.sendStatus(200);
        } catch(err) {
            console.log('ERROR---createOrder', err);
            res.sendStatus(500);
        }
    },
    async getOrders (req: Request, res: Response) {
        try {
            res.status(200).send(await Order.find());
        } catch(err) {
            console.log('ERROR---getOrders', err);
            res.sendStatus(500);
        }
    },
    async getOrderById (req: Request, res: Response) {
        try {
            const orderId = req.enforcer.params.orderId;
            const order = await Order.findOne({_id: orderId});
            if (order) {
                res.status(200).send(order);
            }
            res.status(404).send(new Error(`Order with id '${orderId}' not found.`, 404));
        } catch(err) {
            console.log('ERROR---getOrderById', err);
            res.sendStatus(500);
        }
    },
    async deleteOrder (req: Request, res: Response) {
        try {
            const orderId = req.enforcer.params.orderId;
            await Order.deleteOne({_id: orderId});
            res.sendStatus(204);
        } catch(err) {
            console.log('ERROR---deleteOrder', err);
            res.sendStatus(500);
        }
    },
  }
}

