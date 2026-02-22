import express from "express";
const router = express.Router();
import { addHotel ,addRoom  , filterHotel , gethotelById} from "../controllers/hotelController.js";
import { Protect ,isOwner} from "../middlewares/AuthMiddleware.js";

router.post("/",Protect , isOwner , addHotel);
router.get("/",Protect , filterHotel);
router.post("/:hotelId/rooms",Protect , isOwner , addRoom);
router.get("/:hotelId",gethotelById)
export default router;