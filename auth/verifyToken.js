import jwt from 'jsonwebtoken';
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';


export const authenticate = (req, res, next) => {
    // get token from headers

    const authToken = req.headers.authorization


    //bearer actual token
    if (!authToken || !authToken.startsWith('Bearer')) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' })
    }

    try {
        console.log(authToken);
        const token = authToken.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.userId = decoded.id
        req.role = decoded.role

        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: 'Token is expired' })
        }

        return res.status(401).json({ success: false, message: 'Invalid Token' })
    }
};

export const restrict = roles => async (req, res, next) => {
    try {
        const userId = req.userId;
        console.log("userId:", userId); // 🔍 Log user object from JWT

        const patient = await User.findById(userId);
        const doctor = await Doctor.findById(userId);

        let user = await User.findById(userId) || await Doctor.findById(userId);

        if (!user.role) {
            console.error("❌ User role missing:", user);
            return res.status(400).json({ success: false, message: "User role not set" });
          }
          
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!roles.includes(user.role)) {
            return res.status(401).json({ success: false, message: "You're not authorized" });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
