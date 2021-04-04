export default function (mongoose: any) {
    const orderSchema = new mongoose.Schema({
        price: Number,
        dateCreated: String,
        // expectedArrivalDate: String,
        // label: String,
        // trackingId: String,
        items: Array,
        status: String,
        address: Object,
        username: String
    });

    return mongoose.model('Order', orderSchema);
}