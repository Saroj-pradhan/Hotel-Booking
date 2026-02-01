import express from "express";
const router = express.Router();
import { addHotel } from "../controllers/hotelController.js";
import { Protect ,isOwner} from "../middlewares/AuthMiddleware.js";

router.post("/",Protect , isOwner , addHotel);

export default router;