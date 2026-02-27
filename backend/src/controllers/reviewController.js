import ApiError from "../utils/ApiError.js";
import Review from "../models/Reviews.js";
import Booking from "../models/Bookings.js";
import Hotel from "../models/Hotels.js";
export const addReview = async function(req,res){
    try{
        const user = req.user;
  const {bookingId, rating,comment} = req.body;
  if(!bookingId || !rating || !comment) throw new ApiError(400 ,"INVALID_REQUEST");
  const bookingDetail = await Booking.findById(bookingId);
  if(!bookingDetail) throw new ApiError(404,"BOOKING_NOT_FOUND");
  if(!bookingDetail.user_id.equals(user.id)) throw new ApiError(403 ,"FORBIDDEN");
  const today = new Date();
  today.setHours(0,0,0,0);
  if(bookingDetail.status != "confirmed" || new Date(bookingDetail.check_out_date) > today) throw new ApiError(404,"BOOKING_NOT_ELIGIBLE");
  let existReview = await Review.findOne({user_id:user.id});

  if(existReview) throw new ApiError(400,"ALREADY_REVIEWED");
  const reviewAdded = await Review.create({
           user_id :user.id,
           hotel_id :bookingDetail.hotel_id,
           booking_id :bookingId,
           rating ,
           comment
  })
  const hotelDetails = await Hotel.findOneAndUpdate({_id:reviewAdded.hotel_id},
    [
       { $set:{
     rating:{$divide:[
        {
            $add:[{$multiply:["$rating","$total_reviews"]},rating]
        },
        {$add:["$total_reviews",1]}
     ]},
     total_reviews:{$add:["$total_reviews",1]}
        }
    }
    ],
{
new:true,
updatePipeline: true
}
  );

  res.status(200).json({
    "success":true,
    "data":reviewAdded,
    'error':null
  })
    }catch(error){
res.status(error.statusCode || 500).json({
    "success":false,
"data":null,
"error":error.message || "server error"
})
    }
}