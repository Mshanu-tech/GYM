const mongoose  = require("mongoose")
const paymentSchema = new mongoose.Schema({
    paymentId: String,
    amount: Number,
    userId: String,
    status: String,
  });
  
  const Payment = mongoose.model('Payment', paymentSchema)

  module.exports = Payment