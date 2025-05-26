import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending"
  },
  ticketPrice: {
    type: Number,
    required: true,
    min: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Populate user and doctor details when querying appointments
AppointmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  }).populate({
    path: 'doctor',
    select: 'name photo specialization'
  });
  next();
});

export default mongoose.model("Appointment", AppointmentSchema); 