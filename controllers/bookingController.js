import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'
import Stripe from 'stripe'

export const getCheckoutSession = async(req, res) =>{
    try{
        // Check if Stripe key is configured
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Stripe secret key is not configured')
            return res.status(500).json({
                success: false, 
                message: 'Payment system is not configured properly'
            })
        }

        const doctor = await Doctor.findById(req.params.doctorId)
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: 'https://medicare-frontend-production.up.railway.app/checkout-success',
            cancel_url: `https://medicare-frontend-production.up.railway.app/doctors/${doctor._id}`,
            customer_email: user.email,
            client_reference_id: req.params.doctorId,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: doctor.ticketPrice * 100,
                        product_data: {
                            name: doctor.name,
                            description: doctor.bio,
                            images: [doctor.photo]
                        }
                    },
                    quantity: 1
                }
            ]
        })

        // Create booking record
        const booking = new Booking({
            doctor: doctor._id,
            user: user._id,
            ticketPrice: doctor.ticketPrice,
            session: session.id
        })

        await booking.save()

        res.status(200).json({
            success: true, 
            message: 'Successfully created checkout session', 
            session
        })
    } catch(err) {
        console.error('Error in getCheckoutSession:', err)
        res.status(500).json({
            success: false, 
            message: 'Error creating checkout session',
            error: err.message
        })
    }
}
