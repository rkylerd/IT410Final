import { Request, Response } from 'express'
import Error from '../models/Error'

export default function (
    mongoOrderSchema: (mongoose: any) => any,
    { isTokenValid }: { isTokenValid: Function },
    mongoose: any
) {
    const Order = mongoOrderSchema(mongoose);

    return {
        async createOrder(req: Request, res: Response) {
            if (await isTokenValid(req, res)) {
                try {
                    const newOrder = new Order({
                        ...req.enforcer.body
                    });
                    await newOrder.save();
                    res.sendStatus(200);
                } catch (err) {
                    console.log('ERROR---createOrder', err);
                    res.sendStatus(500);
                }
            }
        },
        async getOrders(req: Request, res: Response) {
            if (await isTokenValid(req, res, undefined, true)) {
                try {
                    res.status(200).send(await Order.find());
                } catch (err) {
                    console.log('ERROR---getOrders', err);
                    res.sendStatus(500);
                }
            }
        },
        async getOrdersOfUser(req: Request, res: Response) {
            const { username = "" } = req.enforcer.params;
            if (await isTokenValid(req, res, username)) {
                try {
                    res.status(200).send(await Order.find({ username }));
                } catch (err) {
                    console.log('ERROR---getOrders', err);
                    res.sendStatus(500);
                }
            }
        },
        async getOrderById(req: Request, res: Response) {
            if (await isTokenValid(req, res)) {
                try {
                    const orderId = req.enforcer.params.orderId;
                    const order = await Order.findOne({ _id: orderId });
                    if (order) {
                        res.status(200).send(order);
                    }
                    res.status(404).send(new Error(`Order with id '${orderId}' not found.`, 404));
                } catch (err) {
                    console.log('ERROR---getOrderById', err);
                    res.sendStatus(500);
                }
            }
        },
        async findOrdersByStatus(req: Request, res: Response) {
            if (await isTokenValid(req, res, undefined, true)) {
                const { status = "" } = req.enforcer.query;
                try {
                    const orders = await Order.find({ status: { $in: status.split("|") } });
                    res.status(200).send(orders);
                } catch (err) {
                    console.log('ERROR---getOrderById', err);
                    res.sendStatus(500);
                }
            }
        },
        async deleteOrder(req: Request, res: Response) {
            if (await isTokenValid(req, res)) {
                try {
                    const orderId = req.enforcer.params.orderId;
                    await Order.deleteOne({ _id: orderId });
                    res.sendStatus(204);
                } catch (err) {
                    console.log('ERROR---deleteOrder', err);
                    res.sendStatus(500);
                }
            }
        },
    }
}

