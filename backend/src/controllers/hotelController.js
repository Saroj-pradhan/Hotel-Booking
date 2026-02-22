import ApiError from "../utils/ApiError.js";
import Hotel from "../models/Hotels.js";
import Room from "../models/Rooms.js"
import mongoose from "mongoose";
export const addHotel = async function (req, res, next) {
  try {
    const { name, description, city, country, amenities } = req.body;
    const user = req.user;
    const owner_id = user.id;
    if (!name || !description || !city || !country || !amenities)
      throw new ApiError(400, "INVALID_REQUEST");
    const CreateHotel = await Hotel.create({
      name,
      description,
      city,
      country,
      amenities,
      owner_id,
    }); 
    
    res.status(201).json({
      success: true,
      data: CreateHotel,
      error: null,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      data: null,
      error: error.message || "SERVER ERROR",
    });
  }
};
export const addRoom = async function(req,res){
try {
    const {roomNumber,roomType,  pricePerNight,maxOccupancy} = req.body;
    if(!roomNumber|| !roomType || !pricePerNight || !maxOccupancy) throw new ApiError(400,"INVALID_REQUEST");
    const user = req.user;
   
 
    const { hotelId } = req.params;
       const HotelDetail =await Hotel.findOne({_id:hotelId});
       if(!HotelDetail) throw new ApiError(404,"HOTEL_NOT_FOUND");
       if(!HotelDetail.owner_id == user.id) throw new ApiError(403,"FORBIDDEN");
    
  const isExistRoom =await Room.exists({hotel_id : hotelId,  room_number:roomNumber});
  if(isExistRoom) throw new ApiError(400,"ROOM_ALREADY_EXISTS");
  const room  =await Room.create({
    hotel_id : hotelId,
        room_number:roomNumber,
        room_type :roomType,
        price_per_night:pricePerNight,
        max_occupancy:maxOccupancy
   
  })
    res.status(201).json(
      {
  "success": true,
  "data":room,
  "error": null
}
    );
} catch (error) {
     res.status(error.statusCode || 500).json({
      success: false,
      data: null,
      error: error.message || "SERVER ERROR",
    });
}
}

export const filterHotel = async function (req, res, next) {
  try {
   const { city , country , minPrice ,maxPrice , minRating } = req.query;
 const pipeline = [];
  let hotellMatch = {}; 
    
    if(country){ hotellMatch.country =  new RegExp(`^${country}` , "i")};
    if(city){ hotellMatch.city = new RegExp(`^${city}`, "i")}
    if(minRating){ hotellMatch.rating= {$gte:Number(minRating)}}

   if(Object.keys(hotellMatch).length > 0) {
    pipeline.push({
      $match:hotellMatch
    })
   }
   pipeline.push({
    $lookup:{
      from:"rooms",
      localField:"_id",
      foreignField:"hotel_id",
      as:"rooms"
    }
   })
   pipeline.push({
    $addFields:{
      "minPricePerNight":{$min:"$rooms.price_per_night"}
     }
   })
   let priceMatch = {};
if(minPrice) {
  priceMatch.$lte=Number(maxPrice);
}
if(maxPrice) {
  priceMatch.$gte=Number(minPrice);
}
if(Object.keys(priceMatch).length>0){
pipeline.push({
  $match:{
   minPricePerNight: priceMatch
  }
})
}
    const filteredHotels = await Hotel.aggregate(pipeline);
    res.status(200).json({
      success: true,
      data: filteredHotels.map((dt)=>(
        {
         id:dt._id,
      name:dt.name,
      description:dt.description,
      city: dt.city,
      country:dt.country,
      amenities: dt.amenities,
      rating: dt.rating,
      totalReviews: dt.totalReviews,
      minPricePerNight:dt.minPricePerNight
    }
      ))

      ,
      error: null,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      data: null,
      error: error.message || "SERVER ERROR",
    });
  }
};

export const gethotelById =async function (req,res){
try {
  const {hotelId} = req.params;
  let pipeline  = [];
  let matchHotel = {};
matchHotel._id = new mongoose.Types.ObjectId(hotelId);
pipeline.push({
  $match:matchHotel
})

pipeline.push({
$lookup:{
  from:"rooms",
  localField:"_id",
  foreignField:"hotel_id",
  as:"rooms"
}
})


const AllHotels = await Hotel.aggregate(pipeline);
if(AllHotels.length <= 0) throw new ApiError(404,"HOTEL_NOT_FOUND");
let data = AllHotels[0];
  res.status(200).json({
    "success":true,
    "data":{
      "id": data._id,
    "ownerId":data.owner_id,
    "name": data.name,
    "description": data.description,
    "city": data.city,
    "country": data.country,
    "amenities": data.amenities,
    "rating": data.rating,
    "totalReviews": data.totalReviews,
    "rooms":data.rooms.map((dt)=>({
   "id": dt._id,
        "roomNumber": dt.room_number,
        "roomType":dt.room_type ,
        "pricePerNight":dt.price_per_night ,
        "maxOccupancy": dt.max_occupancy,
    }))
    },
    "error":null
  });
} catch (error) {
  res.status(error.statusCode || 500).json({
  "success": false,
  "data": null,
  "error":error.message || "Server Error"
  });
}
}