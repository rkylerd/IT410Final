import { Request, Response } from 'express'
import CustomError from './models/Error'
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

const { parsed: { SECRET } } = config();
//generate a token
const generateToken = (data: any) => {
    return jwt.sign(data, SECRET, {
        expiresIn: '1hr',
    });
};

const removeOldTokens = (tokens: string[]) => {
    return tokens.filter(token => {
        try {
            internalJwtVerify(token);
            return true;
        } catch (error) {
            return false;
        }
    });
};

const internalJwtVerify = (token: string) => {
    return jwt.verify(token, SECRET);
}

const verifyToken = (req: any, res: any) => {
    const bearer: string = req.headers['authorization'] || "";

    return new Promise((resolve, reject) => {
        if (!bearer) {
            reject("Missing JWT from authorization header.");
            return;
        }

        const [, token = ""] = bearer.split(' ');

        try {
            req.token = token;
            resolve(internalJwtVerify(token));
        } catch (err) {
            reject("Invalid or expired JWT.");
        }
    });
};

const isTokenValid = async (req: Request, res: Response, username: string = "", mustBeAdmin: boolean = false) => {
    try {
        // @ts-ignore
        const { username: jwtUsername = "", role = "" } = await verifyToken(req, res);
        if (username && username !== jwtUsername) throw Error("JWT belongs to another user.");
        if (mustBeAdmin && role !== "ADMIN") {
            res.status(403).send(new CustomError("Unauthorized to perform that action.", 403));
            return false;
        }
        return true;
    } catch (err) {
        res.status(401).enforcer.send(new CustomError(err.toString(), 401));
        return false;
    }
}

export default {
    generateToken,
    isTokenValid,
    verifyToken,
    removeOldTokens
};
