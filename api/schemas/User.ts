export default function (mongoose: any, bcrypt: any, removeOldTokens: Function) {

    const userSchema = new mongoose.Schema({
        username: String,
        role: {
            type: String,
            default: "USER"
        },
        email: String,
        password: String,
        fname: String,
        lname: String,
        phone: String,
        addresses: [],
        tokens: []
    });

    userSchema.methods.addToken = function (token: string) {
        this.tokens.push(token);
    }

    userSchema.methods.removeToken = function (token: string) {
        this.tokens = this.tokens.filter((t: string) => t !== token);
    }

    userSchema.methods.removeOldTokens = function () {
        this.tokens = removeOldTokens(this.tokens);
    }

    userSchema.methods.toJSON = function () {
        let obj = this.toObject();
        delete obj.token;
        return obj;
    }

    userSchema.pre('save', async function (next: Function) {
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

    userSchema.methods.comparePassword = async function (password: String) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            return false;
        }
    };

    userSchema.methods.isTokenWhiteListed = function (token: String) {
        return this.tokens.includes(token);
    }

    return mongoose.model('User', userSchema);
}