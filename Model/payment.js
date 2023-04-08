const mongoose  = require("mongoose")
const PaymentSchema = new mongoose.Schema({
  amount: {
    type: Number
  },
  order_id: {
    type: String,
    required: true
  },
  userId:{
    type:String
  },
  username:{
    type:String
  },
  number:{
    type:Number
  },
  date:{
    type:String
  },
  day:{
    type:String
  },
  pendingday:{
    type:Number
  }
});

const Payment = mongoose.model('Payment', PaymentSchema);
  module.exports = Payment