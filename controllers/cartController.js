const User = require('../models/userModel');
const Product = require('../models/productModel');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    const cartItemIndex = user.cart.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      // Update quantity
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      // Add new item
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
        const user = await User.findById(req.user._id);
        const cartItem = user.cart.find(item => item.product.toString() === productId);

        if (cartItem) {
            cartItem.quantity = quantity;
            await user.save();
            res.json(user.cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;
    try {
        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};