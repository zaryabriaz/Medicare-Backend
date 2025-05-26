import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const generateToken = user =>{
    return jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET_KEY,{ expiresIn: "15d"} )
}
export const register = async (req, res) => {
    const {email, password, name, role, photo, gender} = req.body


    try {
        let user = null
        if(role==="patient"){
            user= await User.findOne({email})
        }
        else if(role==="doctor"){
            user = await Doctor.findOne({email})
        }

        if(user){
            return res.status(400).json({message: "User already exist"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        if(role==='patient'){
            user = new User({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            })
        }

        if(role==='doctor'){
            user = new Doctor({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            })
        }

        await user.save()
        res.status(200).json({success: true, message: 'User successfully created'})

    } catch (err) {
        res.status(500).json({success: false, message: "Internal server error, Try again"})
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = null;

        const patient = await User.findOne({ email });
        const doctor = await Doctor.findOne({ email });

        if (patient) {
            user = patient;
        } else if (doctor) {
            user = doctor;
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ FIXED: compare plain password to hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = generateToken(user);

        const { password: _, role, appointments, ...rest } = user._doc;

        res.status(200).json({
            message: "Successfully login",
            token,
            data: {
                ...rest,
                photo: user.photo
            },
            role
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: "Failed to login" });
    }
};
