const Razorpay = require("razorpay");
const Orders = require("../model/orders");
const user = require('./user');

exports.buyPremium = async (req, res, next) => {
  try {
    // const key_id=process.env.KEY_ID;
    // const key_secret=process.env.KEY_SECRET;
    var rzp = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET
    });
    // console.log(key_id);
    const amount = 2500;

    const order = await rzp.orders.create({ amount, currency: "INR" });
    // console.log(order);

    await req.user.createOrder({ orderid: order.id, status: "PENDING" });
    res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    console.log(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;    
    // console.log(req.body);
    // console.log('orser>>>', order_id)
    const order=await Orders.findOne(      
      { where: { orderid: order_id } }
    )
    const promise1 = order.update({ status: 'successful', paymentid: payment_id });
    const promise2 = req.user.update({ isPremium: true });
     Promise.all([promise1, promise2]).then(()=>{
        return res.status(202).json({ success: true, message: "transaction successful", token:user.generateToken(req.user.id, undefined, true)   });
     })
     .catch(err=>{
        throw new Error(err);
     })       
        
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
};


