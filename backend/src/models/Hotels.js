import mongoose from "mongoose";
const HotelsSchema = new mongoose.Schema({
   
   
    owner_id :{type:mongoose.Schema.Types.ObjectId , require:true , ref:'User'},
    name :{type:String,require:true},
    description :{type:String},
    city :{type:String,require:true},
    country :{type:String,require:true},
    amenities: {type:[String], default:[]},
    rating :{type:Number,min:0,max:5, default:0.0},
    total_reviews :{type:Number,default:0},
    timestamps:{createdAt:"created_at", updatedAt:false}
}) 

const Hotels = mongoose.model('Hotels',HotelsSchema);
export default Hotels;