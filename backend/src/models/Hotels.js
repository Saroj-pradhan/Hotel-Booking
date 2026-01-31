import mongoose from "mongoose";
const HotelsSchema = new mongoose.Schema({
    owner_id :{type:mongoose.Schema.Types.ObjectId , required:true , ref:'User'},
    name :{type:String,required:true},
    description :{type:String},
    city :{type:String,required:true},
    country :{type:String,required:true},
    amenities: {type:[String], default:[]},
    rating :{type:Number,min:0,max:5, default:0.0},
    total_reviews :{type:Number,default:0},
   
}, {
    timestamps: { createdAt: "created_at", updatedAt: false }
  }) 

const Hotel = mongoose.model('Hotel',HotelsSchema);
export default Hotel;