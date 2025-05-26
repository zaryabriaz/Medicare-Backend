import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  photo: { type: String },
  ticketPrice: { type: Number, required: true },
  role: {
    type: String,
    enum: ["doctor"],
    default: "doctor"
  },

  // Fields for doctors only
  specialization: { type: String, required: true },
  qualifications: [{
    startingDate: { type: Date, required: true },
    endingDate: { type: Date, required: true },
    degree: { type: String, required: true },
    university: { type: String, required: true }
  }],

  experiences: [{
    startingDate: { type: Date, required: true },
    endingDate: { type: Date, required: true },
    position: { type: String, required: true },
    hospital: { type: String, required: true }
  }],

  bio: { type: String, maxLength: 50, required: true },
  about: { type: String, required: true },
  timeSlots: [{
    day: { type: String, required: true },
    startingTime: { type: String, required: true },
    endingTime: { type: String, required: true }
  }],
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRating: {
    type: Number,
    default: 0,
    min: 0
  },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending"
  },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
}, { timestamps: true });

export default mongoose.model("Doctor", DoctorSchema);