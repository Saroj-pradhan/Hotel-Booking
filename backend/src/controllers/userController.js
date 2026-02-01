import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
export const userSignup = async (req, res) => {
  console.log("reached")
  try {
    const {email} = req.body;
    console.log("reached3")
    console.log(email);
    const user = await User.create(req.body);
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.created_at;
   console.log(userObj);
    res.status(201).json({
      success: true,
      data: userObj,
      error: null,
    });
  } catch (error) {
    console.log(error)
    if (error.code == 11000) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "EMAIL_ALREADY_EXISTS",
      });
    }
    res.status(400).json({
      success: false,
      data: null,
      error: error,
    });
  }
};

export const userLogin = async function(req,res){
try {
  const{email,password} = req.body;
   if (!email || !password)   throw new ApiError(400, "INVALID_REQUEST");
  const user =await User.findOne({email}).select("+password");
  if(!user)  throw new ApiError(401,"INVALID_CREDENTIALS");
  const isMatch = await user.matchPassword(password);
  if(!isMatch) throw new ApiError(401,"INVALID_CREDENTIALS");
  const token = await jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});

    const userObj = user.toObject();
    delete userObj.password;

  res.status(200).json({
    "success": true,
  "data":{
    "token": token,
    "user":userObj
    },
  "error": null
  })
} catch (error) {
  res.status(error.statusCode||500).json({
     "success": false,
  "data": null,
  "error": error.message || "SERVER_ERROR"
  })
}
}