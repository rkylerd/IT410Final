export default function (mongoose: any) {
    const itemSchema = new mongoose.Schema({
        _id: Number,
        name: String,
        price: Number,
        category: String,
        description: String,
        imageUrl: String,
        stock: Number,
        sizes: [],
        promotionalFlag: Boolean,
        promotionalPrice: Number
    });

    return mongoose.model('Item', itemSchema);
}