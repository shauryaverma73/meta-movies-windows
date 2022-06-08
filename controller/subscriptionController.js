const User = require('./../model/userModel');
const stripe = require('stripe')('sk_test_51L5oipSICxPwE1Eu2Ozn7wmT1yY2ehjoMZvcx6aUElOdSqpqSxttI0MXD9GIEU7umPDdCzbhsYLHkSUom2pXcOMB00h0jvkQBL');
// const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

exports.checkoutPremiumSubscription = async (req, res) => {
    try {
        // 1.find the currently logged in user
        const user = await User.findById(req.user.id);

        // if subscription is valid show error to user
        if (user.subscriptionDuration > new Date()) {
            return res.status(201).json({
                status: 'error',
                message: `You have a valid Subscription: ${user.subscription}`
            });
        }

        // 2.create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/premium/paymentSuccess/${user.id}?session_Id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/buy-subscription`,
            customer_email: user.email,
            client_reference_id: `${req.user.id}`,
            line_items: [
                {
                    name: 'Premium Subscription',
                    description: '6 Months Access || FullHD || 2 Screens || Any Device || 24/7 Support',
                    amount: 599 * 100,
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

        // if subscription is valid show error to user
        if (user.subscriptionDuration > new Date()) {
            return res.status(201).json({
                status: 'error',
                message: `You have a valid Subscription: ${user.subscription}`
            });
        }

        // 2.create checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/cinematic/paymentSuccess/${user.id}?session_Id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/buy-subscription`,
            customer_email: user.email,
            client_reference_id: `${req.user.id}`,
            line_items: [
                {
                    name: 'Cinematic Subscription',
                    description: '1 Year Access || FullHD || 2 Screens || Any Device || 24/7 Support',
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

exports.verifyAndUpdateStatusPremium = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        await user.setPremiumSubscription();
        await user.save({ validateBeforeSave: false });

        res.status(200).redirect('/');

    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: 'something went very wrong'
        });
    }


};

exports.verifyAndUpdateStatusCinematic = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        await user.setCinematicSubscription();
        await user.save({ validateBeforeSave: false });

        res.status(200).redirect('/');

    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: 'Something went very wrong'
        });
    }
};