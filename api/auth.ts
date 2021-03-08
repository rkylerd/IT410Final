const jwt = require('jsonwebtoken')
const { config } = require('dotenv')
const { parsed: {SECRET} } = config();

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
        }

        const [,token = "" ] = bearer.split(' ');
        
        try {
            req.token = token;
            const decoded = internalJwtVerify(token);
            resolve(decoded);
        } catch (err) {
            reject("Invalid or expired JWT.");
        }
    }); 
};

export default {
    generateToken,
    verifyToken,
    removeOldTokens
};
