import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'
import Stripe from 'stripe'

export const getCheckoutSession = async(req, res) =>{
    try{
        console.log('Starting checkout session creation...')
        console.log('Request headers:', {
            origin: req.headers.origin,
            host: req.headers.host,
            referer: req.headers.referer
        })

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
            console.error('Doctor not found:', req.params.doctorId)
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }
        console.log('Doctor found:', doctor.name)

        const user = await User.findById(req.userId)
        if (!user) {
            console.error('User not found:', req.userId)
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        console.log('User found:', user.name)

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
        console.log('Stripe instance created')

        // Get the frontend URL from the request origin
        const frontendUrl = req.headers.origin || 'http://localhost:5173'
        console.log('Using frontend URL:', frontendUrl)

        const successUrl = `${frontendUrl}/checkout-success`
        const cancelUrl = `${frontendUrl}/doctors/${doctor._id}`
        
        console.log('Generated URLs:', { successUrl, cancelUrl })

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
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
        console.log('Stripe session created:', session.id)

        // Create booking record
        const booking = new Booking({
            doctor: doctor._id,
            user: user._id,
            ticketPrice: doctor.ticketPrice,
            session: session.id
        })

        await booking.save()
        console.log('Booking record created:', booking._id)

        res.status(200).json({
            success: true, 
            message: 'Successfully created checkout session', 
            session
        })
    } catch(err) {
        console.error('Detailed error in getCheckoutSession:', {
            message: err.message,
            stack: err.stack,
            type: err.type,
            code: err.code,
            raw: err
        })
        res.status(500).json({
            success: false, 
            message: 'Error creating checkout session',
            error: err.message,
            details: {
                type: err.type,
                code: err.code
            }
        })
    }
}
