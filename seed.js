import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/UserSchema.js';
import Doctor from './models/DoctorSchema.js';
import Appointment from './models/AppointmentSchema.js';
import Review from './models/ReviewSchema.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        email: 'john@example.com',
        password: hashedPassword,
        name: 'John Doe',
        phone: 1234567890,
        photo: 'https://example.com/photo1.jpg',
        gender: 'male',
        bloodType: 'A+',
        role: 'patient'
      },
      {
        email: 'jane@example.com',
        password: hashedPassword,
        name: 'Jane Smith',
        phone: 9876543210,
        photo: 'https://example.com/photo2.jpg',
        gender: 'female',
        bloodType: 'O+',
        role: 'patient'
      }
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const seedDoctors = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const doctors = [
      {
        email: 'sarah@example.com',
        password: hashedPassword,
        name: 'Dr. Sarah Johnson',
        phone: 5551234567,
        photo: 'https://example.com/doctor1.jpg',
        ticketPrice: 100,
        role: 'doctor',
        specialization: 'General Surgery',
        qualifications: [
          {
            degree: 'MD',
            university: 'Harvard Medical School',
            startingDate: new Date('2006-09-01T00:00:00.000Z'),
            endingDate: new Date('2010-05-15T00:00:00.000Z')
          }
        ],
        experiences: [
          {
            position: 'Senior Surgeon',
            hospital: 'City Hospital',
            startingDate: new Date('2010-06-01T00:00:00.000Z'),
            endingDate: new Date('2015-12-31T00:00:00.000Z')
          }
        ],
        bio: 'Experienced surgeon in general surgery',
        about: 'Dr. Sarah Johnson is a highly experienced surgeon specializing in general surgery. She has performed over 1000 successful surgeries and is known for her expertise in minimally invasive procedures.',
        timeSlots: [
          {
            day: 'Monday',
            startingTime: '09:00',
            endingTime: '17:00'
          }
        ],
        averageRating: 4.8,
        totalRating: 120,
        isApproved: 'approved',
        reviews: [],
        appointments: []
      },
      {
        email: 'michael@example.com',
        password: hashedPassword,
        name: 'Dr. Michael Chen',
        phone: 5559876543,
        photo: 'https://example.com/doctor2.jpg',
        ticketPrice: 150,
        role: 'doctor',
        specialization: 'Neurology',
        qualifications: [
          {
            degree: 'MD',
            university: 'Stanford Medical School',
            startingDate: new Date('2008-09-01T00:00:00.000Z'),
            endingDate: new Date('2012-05-15T00:00:00.000Z')
          }
        ],
        experiences: [
          {
            position: 'Neurologist',
            hospital: 'University Hospital',
            startingDate: new Date('2012-06-01T00:00:00.000Z'),
            endingDate: new Date('2020-12-31T00:00:00.000Z')
          }
        ],
        bio: 'Expert neurologist in brain disorders',
        about: 'Dr. Michael Chen is a renowned neurologist with extensive experience in treating various neurological disorders. He has published numerous research papers and is a member of several prestigious medical associations.',
        timeSlots: [
          {
            day: 'Tuesday',
            startingTime: '10:00',
            endingTime: '18:00'
          }
        ],
        averageRating: 4.9,
        totalRating: 95,
        isApproved: 'approved',
        reviews: [],
        appointments: []
      }
    ];

    await Doctor.insertMany(doctors);
    console.log('Doctors seeded successfully');
  } catch (error) {
    console.error('Error seeding doctors:', error);
  }
};

const seedAppointments = async () => {
  try {
    const users = await User.find();
    const doctors = await Doctor.find();

    const appointments = [
      {
        doctor: doctors[0]._id,
        user: users[0]._id,
        appointmentDate: new Date('2024-03-20T10:00:00'),
        status: 'pending',
        ticketPrice: 100,
        isPaid: false
      },
      {
        doctor: doctors[1]._id,
        user: users[1]._id,
        appointmentDate: new Date('2024-03-21T14:00:00'),
        status: 'approved',
        ticketPrice: 150,
        isPaid: true
      }
    ];

    await Appointment.insertMany(appointments);
    console.log('Appointments seeded successfully');
  } catch (error) {
    console.error('Error seeding appointments:', error);
  }
};

const seedReviews = async () => {
  try {
    const users = await User.find();
    const doctors = await Doctor.find();

    const reviews = [
      {
        doctor: doctors[0]._id,
        user: users[0]._id,
        reviewText: 'Excellent doctor, very professional and caring.',
        rating: 5
      },
      {
        doctor: doctors[1]._id,
        user: users[1]._id,
        reviewText: 'Great experience, highly recommended.',
        rating: 4
      }
    ];

    await Review.insertMany(reviews);
    console.log('Reviews seeded successfully');
  } catch (error) {
    console.error('Error seeding reviews:', error);
  }
};

const seedAll = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    await Review.deleteMany({});
    
    // Seed new data
    await seedUsers();
    await seedDoctors();
    await seedAppointments();
    await seedReviews();
    
    console.log('All data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedAll(); 