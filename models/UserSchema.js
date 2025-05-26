import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  photo: { type: String },
  gender: { 
    type: String, 
    enum: ["male", "female", "other"],
    required: true
  },
  bloodType: { type: String, required: true },
  role: {
    type: String,
    enum: ["patient", "doctor"],
    default: "patient"
  },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
}, { timestamps: true });

export default mongoose.model("User", UserSchema);