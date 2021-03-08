import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import CustomError from '../models/Error'
import { config } from 'dotenv'
config()

export default function (
        { verifyToken, generateToken, removeOldTokens } : { verifyToken: Function, generateToken: Function, removeOldTokens: Function }, 
        mongoose: any
) {

    const userSchema = new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        fname: String,
        lname: String,
        phone: String,
        addresses: [],
        tokens: []
    });
    
    userSchema.methods.addToken = function(token: string) {
        this.tokens.push(token);
    }
      
    userSchema.methods.removeToken = function(token: string) {
        this.tokens = this.tokens.filter((t:string) => t !== token);
    }
    
    userSchema.methods.removeOldTokens = function() {
        this.tokens = removeOldTokens(this.tokens);
    }

    userSchema.pre('save', async function(next : Function) {
        // only hash the password if it has been modified (or is new)
        if (!this.isModified('password'))
            next();
    
        try {
            // generate a salt
            // @ts-ignore   
            const salt = await bcrypt.genSalt(process.env.SALT_WORK_FACTOR);
        
            // hash the password along with our new salt
            const hash = await bcrypt.hash(this.password, salt);
        
            // override the plaintext password with the hashed one
            this.password = hash;
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    });
    
    userSchema.methods.comparePassword = async function(password: String) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            return false;
        }
    };

    userSchema.methods.isTokenWhiteListed = function (token: String) {
        return this.tokens.includes(token);
    }

    const User = mongoose.model('User', userSchema);

    const isTokenMine = (req: Request, res: Response, user: typeof User) => {
        // the user logged out from this token but it hasn't yet expired
        // @ts-ignore
        if ( !user.isTokenWhiteListed(req.token) ) {
            res.status(401).send(new CustomError( "JWT is invalid or belongs to another user.", 401));
            return false;
        }
        return true;
    }
    
    const isTokenValid = async (req: Request, res: Response, username: string) => {
        try {
            const { username: jwtUsername = "" } = await verifyToken(req, res);
            if (username !== jwtUsername) throw Error("JWT belongs to another user.");
            return true;
        } catch (err) {
            res.status(401).send(new CustomError( err.toString(), 401));
            return false;
        }
    }

    const addJwtToHeader = (user: typeof User, res: Response) => {
        let token = generateToken({ username: user.username });
        
        user.removeOldTokens();
        user.addToken(token);
        user.save();

        res.status(200).set("Authorization", `Bearer ${token}`).send(user);
    };

  return {
    async login(req: Request, res: Response) {
        try {
            let user = await User.findOne({username: req.enforcer.body.username});
            if (!user || !(await user.comparePassword( req.enforcer.body.password)) ) {
                res.status(401).send(new CustomError("Invalid username and password combination. Try again.", 401));
                return;
            }
            addJwtToHeader(user, res);
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    },
    async register (req: Request, res: Response) {
        const{ username = "", password = "", email = "", ...rest } = req.enforcer.body;
        try {
            if (!username || !password || !email) {
                res.status(400).send(new CustomError(`username, password, and email are required fields.`, 400));
                return;
            }
            if ( await User.findOne({username}) ) {
                res.status(400).send(new CustomError(`Select another username.`, 400));
                return;
            }

            const newUser = new User({
                    username,
                    password,
                    email,
                    rest
                });
            await newUser.save();
            addJwtToHeader(newUser, res);
        } catch(err) {
            console.log('ERROR---addUser', err);
            res.sendStatus(500);
        }
    },
    async logout(req: Request, res: Response) {
        const { username = "" } = req.enforcer.params;

        if ( isTokenValid(req, res, username) ) {
            try {
                let user = await User.findOne({username});
                
                if ( isTokenMine(req, res, user) ) {
                    // Invalidate token for the time before the token expires future requests
                    // @ts-ignore
                    user.removeToken( req.token );
                    await user.save();

                    res.sendStatus(204);
                }
            } catch (error) {
                console.log(error, "Error---logout");
                return res.sendStatus(500);
            }
        }
    },
    async getUsers (req: Request, res: Response) {
        const { username = "" } = req.enforcer.params;
        if ( isTokenValid(req, res, username) ) {
            try {
                res.status(200).send(await User.find());
            } catch(err) {
                console.log('ERROR---getUsers', err);
                res.sendStatus(500);
            }
        }
    },
    async getUserByUsername (req: Request, res: Response) {
        const { username = "" } = req.enforcer.params;
        if ( isTokenValid(req, res, username) ) {
            try {
                const user = await User.findOne({username});
                if (user) {
                    res.status(200).send(user);
                }
                res.status(404).send(new CustomError(`User with username '${username}' not found.`, 404));
            } catch(err) {
                console.log('ERROR---getUserById', err);
                res.sendStatus(500);
            }
        }
    },
    async deleteUser (req: Request, res: Response) {
        const { username = "" } = req.enforcer.params;
        if ( isTokenValid(req, res, username) ) {
            try {
                await User.deleteOne({username});
                res.sendStatus(204);
            } catch(err) {
                console.log('ERROR---deleteUser', err);
                res.sendStatus(500);
            }
        }
    },
    async updateUser (req: Request, res: Response) {
        const { username = "" } = req.enforcer.params;
        if ( isTokenValid(req, res, username) ) {
            try {
                // ensure that client isn't injecting other attributes
                const {
                    username, email, password, fname, lname, phone, addresses 
                } = req.enforcer.body;

                const fieldsToUpdate = {
                    username, email, password, fname, lname, phone, addresses 
                };
                
                let user = await User.findOne({ username });
                if ( !user ) {
                    res.status(404).send(new CustomError(`User with username '${username}' not found.`, 404));
                }
    
                Object.entries(fieldsToUpdate).forEach(([k,v]) => {
                    if (v) {
                        // @ts-ignore
                        user[k] = v;
                    }
                });

                user.save();
                res.sendStatus(204);
            } catch(err) {
                console.log('ERROR---updateUser', err);
                res.sendStatus(500);
            }
        }  
    }

  }
}

