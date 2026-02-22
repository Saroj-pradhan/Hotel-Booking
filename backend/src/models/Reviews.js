import mongoose from "mongoose"

const ReviewsSchema =new mongoose.Schema({
       user_id :{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true },
       hotel_id :{type:mongoose.Schema.Types.ObjectId,ref:"Hotel",required:true},
       booking_id :{type:mongoose.Schema.Types.ObjectId,ref:"Booking",required:true},
       rating :{type:Number,min:1 , max:5},
       comment:{type:String},
       created_at:{type:Date,select:false}
   
},{
    timestamps:{createdAt:"created_at",updatedAt:false},
     versionKey:false
})

reviewSchema.index({ user: 1, booking: 1 }, { unique: true });

const Review = mongoose.model("Review",ReviewsSchema);
export default Review;