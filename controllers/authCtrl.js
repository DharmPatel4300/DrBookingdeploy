const userModel = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const moment = require('moment');

//Register 
const registerController = async (req, res) => {

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send({ message: "Invalid user inputs", success: false })
    }
    date = moment(date,"DD-MM-YYYY").toISOString();
    time = moment(time,"HH:mm").toISOString();
    try {
        const exUser = await userModel.findOne({ email });

        if (exUser) {
            return res.status(200).send({ message: "User already exists", success: false })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await userModel.create({
            name, email, password: hashedPassword
        })

        res.status(201).send({ message: "Register Successfully", success: true });

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal server error", success: false })
    }

};

//Login
const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Invalid user inputs", success: false })
    }

    try {
        const exUser = await userModel.findOne({ email });

        if (!exUser) {
            return res.status(404).send({ message: "User not found", success: false })
        }

        const isValidPassword = bcrypt.compare(password, exUser.password);
        
        if (!isValidPassword || exUser.status !== "active") {
            res.status(401).send({ message: "Unauthorized user", success: false });
        } else {
            const token = jwt.sign(
                {
                    id: exUser._id,
                    role: exUser.role,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            )

            // send response
            const user = {
                email: exUser.email,
                role: exUser.role,
                name: exUser.name,
                notifications: exUser.notifications,
                seen_notifications: exUser.seen_notifications,
            }
            res.status(201).send({ message: "You are logged in successfully", success: true, token, user });
        }

    } catch (error) {
        //console.log(error.message);
        res.status(500).send({ message: "Internal server error", success: false })
    }

};

module.exports = { loginController, registerController };