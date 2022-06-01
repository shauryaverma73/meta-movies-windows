const User = require('./../model/userModel');
const stripe = require('stripe')('sk_test_51L5oipSICxPwE1Eu2Ozn7wmT1yY2ehjoMZvcx6aUElOdSqpqSxttI0MXD9GIEU7umPDdCzbhsYLHkSUom2pXcOMB00h0jvkQBL');
// const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

exports.checkoutPremiumSubscription = async (req, res) => {
    try {
        // 1.find the currently logged in user
        const user = await User.findById(req.user.id);
        // 2.create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/`,
            cancel_url: `${req.protocol}://${req.get('host')}/buy-subscription`,
            customer_email: user.email,
            client_reference_id: `${req.user.id}`,
            line_items: [
                {
                    name: 'premium',
                    amount: 999 * 100,
                    currency: 'inr',
                    quantity: 1
                }
            ]
        });
        res.status(200).json({
            status: 'success',
            session
        });
    } catch (err) {
        console.log(err);
    }
};


exports.checkoutCinematicSubscription = async (req, res) => {
    try {
        // 1.find the currently logged in user
        const user = await User.findById(req.user.id);
        // 2.create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/`,
            cancel_url: `${req.protocol}://${req.get('host')}/buy-subscription`,
            customer_email: user.email,
            client_reference_id: `${req.user.id}`,
            line_items: [
                {
                    name: 'premium',
                    amount: 999 * 100,
                    currency: 'inr',
                    quantity: 1
                }
            ]
        });
        res.status(200).json({
            status: 'success',
            session
        });
    } catch (err) {
        console.log(err);
    }
};

// 127.0.0.1:3000/api/v1/subscription/premium/checkout-session
// 127.0.0.1:3000/api/v1/subscription/cinematic/checkout-session