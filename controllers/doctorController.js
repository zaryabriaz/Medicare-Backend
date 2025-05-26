import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateDoctor = async (req, res) => {
    const id = req.params.id

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        res
            .status(200)
            .json({
                success: true,
                message: "Successfully updated",
                data: updateDoctor,
            });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update" })
    }
}


export const getSingleDoctor = async (req, res) => {
    const id = req.params.id

    try {
        const doctor = await Doctor.findById(id).populate('reviews').select("-password");

        if (!doctor) {
            return res.status(404).json({ success: false, message: "No Doctor found" });
        }

        res.status(200).json({
            success: true,
            message: "Doctor found",
            data: doctor,
        });
    } catch (err) {
        res.status(404).json({ success: false, message: "No Doctor found" });
    }
}

export const getAllDoctor = async (req, res) => {
    try {
        const { query } = req.query;
        let doctors;

        if (query) {
            doctors = await Doctor.find({
                isApproved: "approved",
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { specialization: { $regex: query, $options: "i" } }
                ],
            }).select('-password');
        } else {
            doctors = await Doctor.find({ isApproved: "approved" }).select('-password');
        }

        res.status(200).json({
            success: true,
            message: "Doctors found",
            data: doctors,
        });
    } catch (err) {
        res.status(404).json({ success: false, message: "No Doctor found" });
    }
}

export const getDoctorProfile = async(req, res) =>{
    const doctorId = req.userId

    try{
        const doctor = await Doctor.findById(doctorId)

        if(!doctor){
            return res.status(404).json({success: false, message: "Doctor not found"})
        }
        const {password, ...rest} = doctor._doc
        
        // Get unique appointments by using distinct on the user field
        const appointments = await Booking.aggregate([
            { $match: { doctor: doctorId } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$user",
                    latestBooking: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$latestBooking" } }
        ])

        // Populate user details for each appointment
        const populatedAppointments = await Booking.populate(appointments, {
            path: 'user',
            select: 'name photo email gender'
        })

        res.status(200).json({
            success: true, 
            message: 'Profile info is getting', 
            data: {...rest, appointments: populatedAppointments}
        })
    }catch(err){
        res.status(500).json({ success: false, message: "something went wrong"})
    }
};
