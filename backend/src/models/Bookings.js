import mongoose, { Types } from "mongoose";
const BookingSchema = new mongoose.Schema({
    user_id :{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    room_id :{type:mongoose.Schema.Types.ObjectId,ref:"Room",required:true},
    hotel_id :{type:mongoose.Schema.Types.ObjectId,ref:"Hotel",required:true},
    check_in_date :{type:Date,required:true},
    check_out_date:{type:Date,required:true,validate:{
    validator: function(value){
        return value>this.check_in_date;
    },
    message:"Check-out date must be after check-in date"
    }},
    guests :{type:Number,required:true,min:1},
    total_price :{type:Number,required:true,min:0},
    status :{type:String,required:true,enum:['confirmed', 'cancelled'],default:'confirmed'},
    cancelled_at :{type:Date, default:null}
   
},
 {
    timestamps:{createdAt:"booking_date",updatedAt:false},
     versionKey:false
 }
)

const Booking = mongoose.model("Booking",BookingSchema) ;
export default Booking;