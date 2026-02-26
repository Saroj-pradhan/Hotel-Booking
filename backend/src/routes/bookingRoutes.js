import express from "express";
import { Protect } from "../middlewares/AuthMiddleware.js";
import { bookHotel , bookingDetail , cancelBooking } from "../controllers/bookingController.js";

const router = express.Router();
router.post("/",Protect,bookHotel); 
router.get("/",Protect,bookingDetail);
router.put("/:bookingId/cancel",Protect,cancelBooking)
 export default router;