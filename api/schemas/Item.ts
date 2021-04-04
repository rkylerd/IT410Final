export default function (mongoose: any) {
    const itemSchema = new mongoose.Schema({
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