import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new mongoose.Schema({
    name  : {type:String , required:true , trim: true},
    email  : {type:String , required:true , unique:true , lowercase: true},
    password  : {type:String , required:true , select:false},
    role  : {type:String , enum: ["customer", "owner"] , default:"customer" },
    phone  : {type:String , unique:true ,sparse: true},
}, {
    timestamps: { createdAt: "created_at", updatedAt: false }
  })

  UserSchema.pre("save",async function(){
if(!this.isModified("password")) return;
const salt =await  bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password,salt);
return;
  })
   
  UserSchema.methods.matchPassword = async function(EnteredPassword){
return await bcrypt.compare(EnteredPassword,this.password);
  };

const User = mongoose.model("User", UserSchema);
export default User;