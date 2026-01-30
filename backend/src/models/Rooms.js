import mongoose from "mongoose";
const RoomsSchema = new mongoose.Schema({
    hotel_id :{type:mongoose.Schema.Types.ObjectId , ref:"Hotels" },
    room_number:{type:Number,required:true , unique:true},
    room_type :{type:String,required:true},
    price_per_night:{type:Number,required:true , min:1},
    max_occupancy:{type:Number,required:true , min:1},
    timestamps:{createdAt:"created_at" , updatedAt:false}

})
const Rooms = mongoose.model("Rooms",RoomsSchema);
export default Rooms;