import { Request, Response } from 'express'
import CustomError from '../models/Error'

export default function (
    bcrypt: any,
    mongoUserSchema: any,
    { isTokenValid, removeOldTokens, generateToken, verifyToken }: { isTokenValid: Function, generateToken: Function, removeOldTokens: Function, verifyToken: Function },
    mongoose: any
) {

    const User = mongoUserSchema(mongoose, bcrypt, removeOldTokens);

    const isTokenMine = (req: Request, res: Response, user: typeof User) => {
        // the user logged out from this token but it hasn't yet expired
        // @ts-ignore
        if (!user.isTokenWhiteListed(req.token)) {
            res.status(401).enforcer.send(new CustomError("JWT is invalid or belongs to another user.", 401));
            return false;
        }
        return true;
    }

    const addJwtToHeader = (user: typeof User, res: Response, statusCode = 200) => {
        let token = generateToken({ username: user.username, role: user.role });

        user.removeOldTokens();
        user.addToken(token);
        user.save();

        res.set("Authorization", `Bearer ${token}`).sendStatus(statusCode).enforcer;
    };

    return {
        async login(req: Request, res: Response) {
            try {
                let user = await User.findOne({ username: req.enforcer.body.username });
                if (!user || !(await user.comparePassword(req.enforcer.body.password))) {
                    res.status(401).send(new CustomError("Invalid username and password combination. Try again.", 401));
                    return;
                }
                addJwtToHeader(user, res);
            } catch (error) {
                console.log(error);
                return res.sendStatus(500);
            }
        },
        async register(req: Request, res: Response) {
            const { username = "", password = "", email = "", ...rest } = req.enforcer.body;
            try {
                if (!username || !password || !email) {
                    res.status(400).send(new CustomError(`username, password, and email are required fields.`, 400));
                    return;
                }

                const reservedUsernames = ['me'];
                if (reservedUsernames.includes(username) || await User.findOne({ username })) {
                    res.status(400).send(new CustomError(`Select another username.`, 400));
                    return;
                }

                const newUser = new User({
                    username,
                    password,
                    email,
                    ...rest
                });

                await newUser.save();
                addJwtToHeader(newUser, res);
            } catch (err) {
                console.log('ERROR---addUser', err);
                res.sendStatus(500);
            }
        },
        async logout(req: Request, res: Response) {
            const { username = "" } = req.enforcer.params;

            if (await isTokenValid(req, res, username)) {
                try {
                    let user = await User.findOne({ username });

                    if (isTokenMine(req, res, user)) {
                        // Invalidate token for the time before the token expires future requests
                        // @ts-ignore
                        user.removeToken(req.token);
                        await user.save();

                        res.sendStatus(204);
                    }
                } catch (error) {
                    console.log(error, "Error---logout");
                    return res.sendStatus(500);
                }
            }
        },
        async getUsers(req: Request, res: Response) {
            if (await isTokenValid(req, res, undefined, true)) {
                try {
                    res.status(200).send(await User.find());
                } catch (err) {
                    console.log('ERROR---getUsers', err);
                    res.sendStatus(500);
                }
            }
        },
        async getCurrentUser(req: Request, res: Response) {
            let username;
            // Get the username from the decoded JWT
            try {
                // @ts-ignore
                const { username: jwtUsername = "" } = await verifyToken(req, res);
                username = jwtUsername;
            } catch (err) {
                res.status(401).enforcer.send(new CustomError(err.toString(), 401));
                return;
            }

            try {
                const user = await User.findOne({ username });
                if (user) {
                    res.status(200).send(user.stripSenstiveFields());
                    return;
                }
                res.status(404).send(new CustomError(`User with username '${username}' not found.`, 404));
            } catch (err) {
                console.log('ERROR---getCurrentUser', err);
                res.sendStatus(500);
            }
        },
        async getUserByUsername(req: Request, res: Response) {
            const { username = "" } = req.enforcer.params;
            if (await isTokenValid(req, res, undefined, true)) {
                try {
                    const user = await User.findOne({ username });
                    if (user) {
                        res.status(200).send(user);
                        return;
                    }
                    res.status(404).send(new CustomError(`User with username '${username}' not found.`, 404));
                } catch (err) {
                    console.log('ERROR---getUserById', err);
                    res.sendStatus(500);
                }
            }
        },
        async deleteUser(req: Request, res: Response) {
            const { username = "" } = req.enforcer.params;
            if (await isTokenValid(req, res, undefined, true)) {
                try {
                    if (username !== "ADMIN") {
                        await User.deleteOne({ username });
                    }
                    res.sendStatus(204);
                } catch (err) {
                    console.log('ERROR---deleteUser', err);
                    res.sendStatus(500);
                }
            }
        },
        async updateUser(req: Request, res: Response) {
            const { username = "" } = req.enforcer.params;
            if (await isTokenValid(req, res, username)) {
                try {
                    let user = await User.findOne({ username });
                    if (!user) {
                        res.status(404).send(new CustomError(`User with username '${username}' not found.`, 404));
                        return;
                    }

                    if (isTokenMine(req, res, user)) {
                        // ensure we only update the following properties
                        const {
                            username: uname, email, password, fName, lName, phone, addresses
                        } = req.enforcer.body;

                        let existingUser = await User.findOne({ username: uname });
                        if (existingUser) {
                            res.status(400).send(new CustomError(`Select another username. '${uname}' has already been taken.`, 400));
                            return;
                        }

                        const fieldsToUpdate = {
                            username: uname, email, password, fName, lName, phone, addresses
                        };

                        Object.entries(fieldsToUpdate).forEach(([k, v]) => {
                            if (v) {
                                // @ts-ignore
                                user[k] = v;
                            }
                        });

                        await user.save();
                        if (fieldsToUpdate.username) {
                            addJwtToHeader(user, res, 204);
                        } else {
                            res.sendStatus(204);
                        }
                    }
                } catch (err) {
                    console.log('ERROR---updateUser', err);
                    res.sendStatus(500);
                }
            }
        }

    }
}

