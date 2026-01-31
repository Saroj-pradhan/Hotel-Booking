import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    name  : {type:String , required:true , trim: true},
    email  : {type:String , required:true , unique:true , lowercase: true},
    password  : {type:String , required:true , select:false},
    role  : {type:String , required:true ,enum: ["customer", "owner"] },
    phone  : {type:String , unique:true ,sparse: true},
}, {
    timestamps: { createdAt: "created_at", updatedAt: false }
  })

const User = mongoose.model("User", UserSchema);
export default User;