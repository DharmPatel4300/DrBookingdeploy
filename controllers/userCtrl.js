const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const bcrypt = require("bcrypt");
const moment = require('moment');

// get user By id (user id set in authorization)
const getUserController = async (req, res) => {
    const { id } = req.body;

    try {
        let user = await userModel.findById(id);
        if (!user || user.status !== "active") {
            return res.status(403).send({ message: "User not found", success: false })
        }

        /* let doctor = await doctorModel.findOne({userId:user._id},"status");
        if(doctor && doctor.status !== "active"){
            return res.status(401).send({ message: "User is blocked", success: false });
        } */

        user = {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            notifications: user.notifications,
            seen_notifications: user.seen_notifications,
        }

        res.status(201).send({ message: "Get User Successfully !", success: true, user })

    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error", success: false })
    }

};

const getAllDoctors = async (req, res) => {
    const { id } = req.body;
    try {
        //get user
        let user = await userModel.findById(id);

        if (!user) {
            return res.status(403).send({ message: "Unautorized request", success: false })
        }

        const doctors = await doctorModel.find({}).populate("userId", "email")

        res.status(201).send({ message: "All dotors recived !", success: true, data: doctors })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

const updateUserController = async (req, res) => {
    const { id, oldPassword, password } = req.body;
    
    try {
        let user = await userModel.findById(id);
        if (!user) {
            res.status(400).send({ message: "Bad Request Invalid User", success: false });
        }
        if (password) {
            const isValidPassword = bcrypt.compare(oldPassword, user.password);
            if (!isValidPassword) {
                return res.status(401).send({ message: "Unauthorized User", success: false });
            }

            //update password with hashing
            const hashedPassword = await bcrypt.hash(password, 10)
            req.body.password = hashedPassword;
        }

        await user.updateOne(req.body)

        res.status(201).send({ message: "User has been updated Successfully !", success: true, user })

    } catch (error) {
        //console.log(error);
        return res.status(500).send({ message: "Internal Server Error", success: false })
    }

};

// protected route  (user id set in authorization) 
const applyDoctorController = async (req, res) => {
    const {
        id: userId,
        firstName,
        lastName,
        phone,
        website,
        address,
        specialization,
        experience,
        feesPerConsultation,
        timings

    } = req.body;

    if (!userId || !firstName || !lastName || !phone || !timings || !address || !specialization || !experience || !feesPerConsultation) {
        return res.status(400).send({ message: "Iavalid Inputs", success: false })
    }


    try {

        //step-1 create doctors database entry(status-pending)
        const doctor = await doctorModel.create({
            userId,
            firstName,
            lastName,
            phone,
            website,
            timings,
            address,
            specialization,
            experience,
            feesPerConsultation,
            status: "pending"
        })
        if (!doctor) {
            res.status(500).send({ message: "Something went wrong", success: false })
        }

        //step-2 create and push notification for user
        const userNotification = {
            type: "request-doctor-application-reply",
            message: "Congratulations!, Your request is being process we will notify once it has been approved",
            data: {
                onClickPath: "/",
            }
        }

        //step-3 create and push notification for admin( To change user role and status of doctor)
        const adminNotification = {
            type: "request-doctor-application",
            message: `${doctor.firstName} ${doctor.lastName} has applied for doctor account`,
            data: {
                doctorId: doctor._id,
                name: doctor.firstName + " " + doctor.lastName,
                onClickPath: "/admin/doctors",
            }
        }

        //step-4 upadate user and admin in database
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $push: { notifications: userNotification } }
        );
        const updatedAdmin = await userModel.findOneAndUpdate(
            { role: "ADMIN" },
            { $push: { notifications: adminNotification } }
        );
        const user = {
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name,
            notifications: updatedUser.notifications,
            seen_notifications: updatedUser.seen_notifications,
        }

        // all done than send 201 with notification
        res.status(201).send({ message: "Requested for doctor account successfylly !", success: true, user })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }

};

//get all notifications (mark all notifications as seen)
const getAllNotificationsAndMarkAllRead = async (req, res) => {
    const { id } = req.body;
    try {
        //get user
        let user = await userModel.findById(id);
        if (!user) {
            res.status(403).send({ message: "User not found", success: false })
        }
        const notifications = user.notifications;
        const seenNotifications = user.seen_notifications;
        seenNotifications.push(...notifications);
        user.notifications = [];
        user.seen_notifications = seenNotifications;
        const updatedUser = await user.save();

        user = {
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name,
            notifications: updatedUser.notifications,
            seen_notifications: updatedUser.seen_notifications,
        }
        res.status(201).send({ message: "All notification marked as read !", success: true, user })

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

//get all notifications (mark all notifications as seen)
const deleteAllReadNotifications = async (req, res) => {
    const { id } = req.body;
    try {
        //get user
        let user = await userModel.findByIdAndUpdate(id, { $set: { seen_notifications: [] } }, { multi: true });


        user = {
            email: user.email,
            role: user.role,
            name: user.name,
            notifications: user.notifications,
            seen_notifications: user.seen_notifications,
        }
        res.status(201).send({ message: "All notification removed !", success: true, user })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

// POST book appointment
const bookAppointment = async (req, res) => {
    const { time, date, userId, doctorId } = req.body;

    if (!time || !date || !userId || !doctorId) {
        return res.status(400).send({ message: "Invalid Inputs", success: false })
    }



    try {
        const appointment = await appointmentModel.create({
            time, userId, doctorId, date
        })
        if (!appointment) {
            return res.status(500).send({ message: "Invalid Inputs", success: false })
        }

        const userNotification = {
            type: "New-appointment-request",
            message: "Your appointment request has been sent to doctor",
            data: {
                onClickPath: "/user/appointments",
            }
        }

        const doctorNotification = {
            type: "New-appointment-request",
            message: "A new appointment request",
            data: {
                onClickPath: "/user/appointments",
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $push: { notifications: userNotification } }
        );

        const updatedDoctor = await userModel.findByIdAndUpdate(
            doctorId,
            { $push: { notifications: doctorNotification } }
        );

        return res.status(201).send({ message: "Appointment is recived successfully", success: true })

    } catch (error) {
        //console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while booking appointment"
        })
    }
}

const checkBookingAvailability = async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        const fromTime = moment(req.body.time, "HH:mm").subtract(1, 'hours').toISOString();
        const toTime = moment(req.body.time, "HH:mm").add(1, 'hours').toISOString();
        const doctorId = req.body.doctorId;
    
        const appontments = await appointmentModel.find({
            doctorId,
            date,
            time: {
                $gte: fromTime,
                $lte: toTime
            }
        })

        if (appontments && appontments.length > 0) {
            return res.status(200).send({
                success: true,
                message: "No bookings available this time",
                data: {
                    isAvailable: false
                }
            })
        } else {
            return res.status(200).send({
                success: true,
                message: "Yes booking available at this time",
                data: {
                    isAvailable: true
                }
            })
        }


    } catch (error) {
    
        res.status(500).send({
            success: false,
            message: "Error while booking appointment"
        })
    }
}

const userAppointments = async (req,res)=>{
    try {
        const appointments = await appointmentModel.find({
            userId:req.body.id
        }).populate([
            {
                path: "userId",
                select:"name email",
                model:userModel
            },{
                path: "doctorId",
                select:"firstName lastName address specialization feesPerConsultation timings experience",
                model:doctorModel
            }
        ]).exec()
        if (appointments && appointments.length > 0) {
            return res.status(201).send({
                success: true,
                message: "No bookings available this time",
                data:appointments
            })
        } else {
            return res.status(204).send({
                success: false,
                message: "No appointments found",
            })
        }
        
    } catch (error) {
        //console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while booking appointment"
        })
    }
}


module.exports =
{
    getUserController,
    applyDoctorController,
    getAllNotificationsAndMarkAllRead,
    deleteAllReadNotifications,
    updateUserController,
    getAllDoctors,
    bookAppointment,
    checkBookingAvailability,
    userAppointments
};