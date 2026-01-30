import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    name  : {type:String , require:true , trim: true},
    email  : {type:String , require:true , unique:true , lowercase: true},
    password  : {type:String , require:true},
    role  : {type:String , require:true ,enum: ["customer", "owner"] },
    phone  : {type:Number , unique:true},
    timestamps:{createdAt:"created_at" , updatedAt:false}
})

const User = mongoose.model("User", UserSchema);
export default User;