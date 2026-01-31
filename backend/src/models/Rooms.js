import mongoose from "mongoose";
const RoomsSchema = new mongoose.Schema({
    hotel_id :{type:mongoose.Schema.Types.ObjectId , ref:"Hotel" },
    room_number:{type:Number,required:true , unique:true},
    room_type :{type:String,required:true},
    price_per_night:{type:Number,required:true , min:1},
    max_occupancy:{type:Number,required:true , min:1},

},
 {
    timestamps: { createdAt: "created_at", updatedAt: false }
  })
roomSchema.index({ hotel: 1, room_number: 1 }, { unique: true });

const Room = mongoose.model("Room",RoomsSchema);
export default Room;