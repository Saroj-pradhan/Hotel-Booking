import ApiError from "../utils/ApiError.js";
import Hotel from "../models/Hotels.js";
export const addHotel = async function (req, res, next) {
  try {
    const { name, description, city, country, amenities } = req.body;
    console.log(req.user);
    const user = req.user;
    const owner_id = user.id;
    console.log(owner_id, "kkkk");
    if (!name || !description || !city || !country || !amenities)
      throw new ApiError(400, "INVALID_REQUEST");
    const CreateHotel = await Hotel.create({
      name,
      description,
      city,
      country,
      amenities,
      owner_id,
    }); 
    console.log("reached suuu")
    res.status(201).json({
      success: true,
      data: CreateHotel,
      error: null,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      data: null,
      error: error.message || "SERVER ERROR",
    });
  }
};
