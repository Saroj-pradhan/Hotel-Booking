import Room from "../models/Rooms.js";
import Booking from "../models/Bookings.js";
import ApiError from "../utils/ApiError.js";
import Hotel from "../models/Hotels.js";
import mongoose from "mongoose"
export const bookHotel = async function(req,res){
    try {
  const {roomId,checkInDate ,checkOutDate,guests} = req.body;
  if(!roomId ||!checkInDate || !checkOutDate || !guests) throw new ApiError(400,"INVALID_REQUEST");
  const user = req.user;
  let currentDate = new Date();
  currentDate.setHours(0,0,0,0);
    if(currentDate > new Date(checkInDate) || currentDate > new Date(checkOutDate)) throw new ApiError(400,"INVALID_DATES")
  const room = await Room.find({_id:roomId});
  if(room.length <= 0 ) throw new ApiError(404,"ROOM_NOT_FOUND");
   console.log(room[0].hotel_id);
  let Currentroom = room[0];

 const hotel = await Hotel.find({_id:Currentroom.hotel_id});
  console.log(room , hotel);
  console.log(user,'user');
  
 console.log(hotel[0].owner_id,"owwn" );
 let CurrentHotel = hotel[0];
 console.log(CurrentHotel.owner_id.equals(user.id));
 
  if(CurrentHotel.owner_id.equals(user.id)) throw new ApiError(403,"FORBIDDEN");

let isRoomEmpty = await Booking.find({
  room_id:roomId,
 check_in_date:{$lt:new Date(checkOutDate) },
 
check_out_date:{$gt:new Date(checkInDate) }
})
console.log(isRoomEmpty,"roomempty")
let hasBook = false;
if(isRoomEmpty.length > 0){
hasBook=true;
}
if(hasBook) throw new ApiError(400,"ROOM_NOT_AVAILABLE");
 
  if(Currentroom.max_occupancy < guests ) throw new ApiError(400,"INVALID_CAPACITY");

  let  newcheckInDate= new Date(checkInDate);
  let newcheckOutDate =new Date(checkOutDate);
  newcheckInDate.setHours(0, 0, 0, 0);
  newcheckOutDate.setHours(0, 0, 0, 0);
  let total_days = (newcheckInDate - newcheckOutDate) / (1000 * 60 * 60 * 24); 
  if(total_days < 0){
    total_days*=-1;
  }
  let total_cost = Currentroom.price_per_night * total_days;
     const bookMyHotel =await Booking.create({
      user_id :user.id,
         room_id :Currentroom._id,
         hotel_id : CurrentHotel._id,
         check_in_date :checkInDate,
         check_out_date:checkOutDate,
         guests,
         total_price :total_cost,
        })
console.log(bookMyHotel)
  res.status(200).json({
  "success": true,
  "data": {
    "id": bookMyHotel._id,
    "userId": bookMyHotel.user_id,
    "roomId": bookMyHotel.room_id,
    "hotelId": bookMyHotel.hotel_id,
    "checkInDate": bookMyHotel.check_in_date,
    "checkOutDate": bookMyHotel.check_out_date,
    "guests": bookMyHotel.guests,
    "totalPrice": bookMyHotel.total_price,
    "status": bookMyHotel.status,
    "bookingDate": bookMyHotel.booking_date.toString().split("T")[0]
  },
  "error": null

  });

    } catch (error) { 
       res.status(error.statusCode || 500).json({
        "success": false,
  "data": null,
  "error": error.message || "Server Error"
       })
    }
}


export const bookingDetail = async function(req,res){
  
  try {
    const user = req.user;
    const bookingDetails = await Booking.find({user_id:user.id});
    if(bookingDetails.length < 0) throw new ApiError(404,"Booking Not Found");
    res.status(200).json({
      "success": true,
  "data": bookingDetails.map((bookMyHotel)=>({
   "id": bookMyHotel._id,
    "userId": bookMyHotel.user_id,
    "roomId": bookMyHotel.room_id,
    "hotelId": bookMyHotel.hotel_id,
    "checkInDate": bookMyHotel.check_in_date,
    "checkOutDate": bookMyHotel.check_out_date,
    "guests": bookMyHotel.guests,
    "totalPrice": bookMyHotel.total_price,
    "status": bookMyHotel.status,
    "bookingDate": bookMyHotel.booking_date
  })),
  "error": null
    })
  } catch (error) {
     res.status(error.statusCode || 500).json({
        "success": false,
  "data": null,
  "error": error.message || "Server Error"
       })
  }
}

export const cancelBooking = async function(req,res){
   try {
    const user = req.user;
    const {bookingId} = req.params;
    const bookingDetails = await Booking.findById(bookingId);

    if(!bookingDetails) throw new ApiError(404,"BOOKING_NOT_FOUND");
    if(!bookingDetails.user_id.equals(user.id)) throw new ApiError(403,"FORBIDDEN");
    if(bookingDetails.status == "cancelled") throw new ApiError(400,"ALREADY_CANCELLED");

    let today = new Date();
    today.setHours(0,0,0,0);
    let checkIn = new Date(bookingDetails.check_in_date);
   checkIn.setHours(0,0,0,0);
   let RemDay = (checkIn - today)/(1000*60*60*24);
   if(RemDay <2) throw new ApiError(400,"CANCELLATION_DEADLINE_PASSED");
   let cancelbooking = await Booking.findOneAndUpdate({
    _id:bookingId,
    status:{$ne:"cancelled"}
   },
   {
    $set: {status:"cancelled",
      cancelled_at:new Date()
    },
   }
  ,
  {new:true});
  if(!cancelbooking) throw new ApiError(400,"CANCELLATION_FAILED");
    res.status(200).json({
      "success": true,
  "data": {
        "id": cancelbooking._id,
        "status": cancelbooking.status,
        "cancelledAt": cancelbooking.cancelled_at
  },
  "error": null
    })
  } catch (error) {
     res.status(error.statusCode || 500).json({
        "success": false,
  "data": null,
  "error": error.message || "Server Error"
       })
  }
}