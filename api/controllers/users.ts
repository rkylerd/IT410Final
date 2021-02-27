import { Request, Response } from 'express'
import User from '../models/Users'

const users: Array<User> = [];

export default function ({ verifyToken, generateToken } : {verifyToken: Function, generateToken: Function }) {
  return {
    async createUser (req: Request, res: Response) {
        users.push(req.enforcer.body);
        res.sendStatus(200);
    },
    async getUsers (req: Request, res: Response) {
        res.status(200).send(users);
    },
    async getUserById (req: Request, res: Response) {
        console.log('req', req);
        const orderId = req.enforcer.params.orderId;
        const order = users.find(({id = ""}) => {
            console.log(id, orderId);
            return id === `${orderId}`
        });
        res.status(order ? 200 : 404).send(
            order
        );
    },
    async deleteUser (req: Request, res: Response) {
        res.status(204).send();
    },
  }
}

