const Order = require('../models/orderModel');
const User = require('../models/userModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderProducts = user.cart.map(item => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product.toObject(), // Store a snapshot
        quantity: item.quantity
      };
    });

    const order = new Order({
      user: req.user._id,
      products: orderProducts,
      totalAmount
    });

    const createdOrder = await order.save();

    // Clear user's cart
    user.cart = [];
    await user.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
