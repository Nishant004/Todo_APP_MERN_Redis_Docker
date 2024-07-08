const express = require("express")
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require("../models/userModel.js")
const jwt = require('jsonwebtoken')
const authMiddleware = require("../middlewares/authMiddleware.js")


router.post('/register', async (req, res) => {
    try {
        console.log('Received request:', req.body); // Log request body

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({ message: "Name, email, and password are required", success: false });
        }

        // Check if name already exists
        const existingName = await User.findOne({ name });
        if (existingName) {
            return res.status(200).send({ message: "User name already exists", success: false });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(200).send({ message: "Email already exists", success: false });
        }

        // If neither exists, create the new user
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        req.body.password = hashPassword;

        const user = new User(req.body);
        await user.save();
        return res.status(200).send({ message: "User registered successfully", success: true });

    } catch (error) {
        console.error('Error:', error); 
        return res.status(500).send({ message: error.message, success: false });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email and password are required", success: false });
        }

        const user = await User.findOne({ email });
        console.log(user.data)
        if (!user) {
            return res.status(200).send({ message: "User does not exist", success: false });
        }

        const passwordsMatched = await bcrypt.compare(password, user.password);
        if (passwordsMatched) {
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
                expiresIn: "1d"
            });
            return res.status(200).send({
                message: "User logged in successfully",
                success: true,
                data: token,
            });
        } else {
            return res.status(200).send({ message: "Password is incorrect", success: false });
        }
    } catch (error) {
        console.error('Error during login:', error); 
        return res.status(500).send({ message: error.message, success: false });
    }
});


router.post('/get-user-data',authMiddleware,async(req,res) => {
    try {
        const user = await User.findById(req.body.userId);
        user.password = undefined;
        return res.status(200).send({
            message:"User Data fetch successfully",
            success:true,
            data:user,
        })


    } catch(error){
          return res.status(500).send({message: error.message,success:false});l
    }


})









module.exports = router;