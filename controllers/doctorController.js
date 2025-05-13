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
        const Doctor = await Doctor.findById(id).populate('reviews').select("-password");

        res
            .status(200)
            .json({
                success: true,
                message: "Doctor found",
                data: Doctor,
            });
    } catch (err) {
        res.status(404).json({ success: false, message: "No Doctor found" })
    }
}

export const getAllDoctor = async (req, res) => {

    try {
        let doctors;

        if (query) {
            doctors = await Doctor.find({
                isApproved: "approved",
                $or: [{ name: { $regex: query, $options: "i" } },
                { specialization: { $regex: query, $options: "i" } }],
            }).select('-password');
        } else {
            const doctors = await Doctor.find({isApproved: "approved"}).select('-password');

        }


        res.status(200)
            .json({
                success: true,
                message: "Doctors found",
                data: Doctors,
            });
    } catch (err) {
        res.status(404).json({ success: false, message: "No Doctor found" })
    }
}