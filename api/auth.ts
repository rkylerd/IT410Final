const jwt = require('jsonwebtoken')
const { config } = require('dotenv')
const { parsed: {SECRET} } = config();

//generate a token
const generateToken = (data: any) => {
    return jwt.sign(data, SECRET, {
      expiresIn: '1hr',
    });
};


const verifyToken = (req: any, res: any, next: any) => {
    const bearerHeader: string = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, SECRET, (err: any, authData: any) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.token = bearerToken;
                req.user_id = authData.id;
                next();
            }
        })
    }
    else {
        res.sendStatus(401);
    }
};


export default {
    generateToken,
    verifyToken
};
