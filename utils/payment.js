import Razorpay from "razorpay";
import "dotenv/config";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEYID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export default razorpay;
