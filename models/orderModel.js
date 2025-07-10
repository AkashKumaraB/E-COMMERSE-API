const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: Object, required: true }, // Store a snapshot of the product
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;