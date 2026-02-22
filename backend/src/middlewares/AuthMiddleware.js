import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken";
export const Protect = async function(req,res,next){
    try {
     const Token = req.headers.authorization;
     if(!Token || !Token.startsWith("Bearer ")) throw new ApiError(401,"UNAUTHORIZED") ;
     const token = Token.split(" ")[1];
    const verifyToken = jwt.verify(token , process.env.JWT_SECRET_KEY);
    if(!verifyToken) throw new ApiError(401,"UNAUTHORIZED") ;
   req.user = verifyToken;
    return next();
    } catch (error) {
        res.status(error.statusCode || 500).json({
  "success": false,
  "data": null,
  "error": error.message || "server Error"
})
    }
}

export const isOwner = async function(req,res,next){
    try {
      const {role} = req.user;
       if(role == "owner"){
      return next();
       }
     throw new ApiError(401,"FORBIDDEN");
    
   
    } catch (error) {
        res.status(error.statusCode || 500).json({
  "success": false,
  "data": null,
  "error": error.message || "Server Error"
})
    }
}