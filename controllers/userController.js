import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js"
import Doctor from "../models/DoctorSchema.js"

export const updateUser = async(req, res) =>{
    const id = req.params.id

    try{
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {$set: req.body},
            { new: true }
        );

        res
        .status(200)
        .json({
            success: true,
            message: "Successfully updated",
            data: updateUser,
        });
    }catch(err){
        res.status(500).json({ success: false, message: "Failed to update"})
    }
}


export const getSingleUser = async(req, res) =>{
    const id = req.params.id

    try{
        const user = await User.findById(id).select("-password");

        res
        .status(200)
        .json({
            success: true,
            message: "User found",
            data: user,
        });
    }catch(err){
        res.status(404).json({ success: false, message: "No user found"})
    }
}

export const getAllUser = async(req, res) =>{
    const id = req.params.id

    try{
        const users = await User.find({}).select("-password");

        res
        .status(200)
        .json({
            success: true,
            message: "Users found",
            data: users,
        });
    }catch(err){
        res.status(404).json({ success: false, message: "No user found"})
    }
}

export const getUserProfile = async(req, res) =>{
    const userId = req.userId

    try{
        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }
        const {password, ...rest} = user._doc

        res.status(200).json({success: true, message: 'Profile info is getting', data: {...rest}})
    }catch(err){
        res.status(500).json({ success: false, message: "something went wrong"})
    }
};

export const getMyAppointments = async(req, res) =>{
    try{
        console.log('Fetching appointments for user:', req.userId)
        
        const bookings = await Booking.find({user: req.userId})
            .populate({
                path: 'doctor',
                select: 'name photo specialization ticketPrice bio'
            })
            .sort({ createdAt: -1 })

        console.log('Found bookings:', bookings)

        if (!bookings || bookings.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No appointments found",
                data: []
            })
        }

        // Transform the data to match the expected format
        const transformedBookings = bookings.map(booking => {
            console.log('Processing booking:', booking)
            return {
                _id: booking.doctor._id,
                name: booking.doctor.name,
                photo: booking.doctor.photo,
                specialization: booking.doctor.specialization,
                ticketPrice: booking.ticketPrice,
                appointmentDate: booking.createdAt,
                status: booking.status,
                isPaid: booking.isPaid,
                bio: booking.doctor.bio
            }
        })

        console.log('Transformed bookings:', transformedBookings)

        res.status(200).json({
            success: true, 
            message: "Appointments retrieved successfully", 
            data: transformedBookings
        })
    }catch(err){
        console.error('Error in getMyAppointments:', err)
        res.status(500).json({ 
            success: false, 
            message: "Something went wrong while fetching appointments",
            error: err.message
        })
    }
}