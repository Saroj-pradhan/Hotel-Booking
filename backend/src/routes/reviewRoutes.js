import express from "express";
import { addReview } from "../controllers/reviewController.js";
// import { Protect } from "../middlewares/AuthMiddleware";
const router = express.Router();
// import { Protect } from "../middlewares/AuthMiddleware";
router.post("/",Protect,addReview);
export default router; 
import { Protect } from "../middlewares/AuthMiddleware.js";