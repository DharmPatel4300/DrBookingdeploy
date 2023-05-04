const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const mongoose = require('mongoose');
const { Types } = mongoose;

const getDoctorById = async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.query.doctorId)
        if (!doctor) {
            res.status(403).send({
                success: false,
                message: "Doctor not found",
            })
        }
        res.status(201).send({
            success: true,
            message: "Doctor Info fetch success",
            data: doctor,
        })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

const getDoctorInfo = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.id })
        if (!doctor) {
            return res.status(204).send({
                success: false,
                message: "Doctor Info not found",
            })
        }

        res.status(201).send({
            success: true,
            message: "Doctor Info fetch success",
            data: doctor,
        })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

const updateDoctorInfo = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.id }, req.body)
        res.status(201).send({
            success: true,
            message: "Doctor Info updated success",
            data: doctor,
        })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

const doctorAppointments = async (req, res) => {

    const userId = req.body.id;

    // Find the doctor document that corresponds to the given user id
    /* try {
        const appointments = await appointmentModel.aggregate([
            
            {
                $lookup: {
                    from: 'doctors',
                    localField: 'doctorId',
                    foreignField: '_id',
                    as: 'doctor'
                }
            },
            {
                $unwind: '$doctor'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'doctor.userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userId'
                }
            },
            {
                $unwind: '$doctor'
            },
            {
                $match: {
                    'user._id': new Types.ObjectId(userId)
                }
            }


        ])

        //console.log(appointments);
        res.status(201).send({
            success: true,
            message: "All apointments are here",
            data:appointments
        })

    } catch (err) {
        //console.log(err);
        res.status(500).send({ message: "Internal Server Error", success: false })
    } */

    //It's strange but this 2 time querying give better sesponse time
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.id },"userId");
        const appointments = await appointmentModel.find({
            doctorId: doctor._id
        }).populate([
            {
                path: "userId",
                select: "name email",
                model: userModel
            }, {
                path: "doctorId",
                select: "firstName lastName address specialization feesPerConsultation timings experience",
                model: doctorModel
            }
        ])
        if (appointments && appointments.length > 0) {
            //console.log(appointments);
            return res.status(201).send({
                success: true,
                message: "No bookings available this time",
                data: appointments
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

const handleApproveBooking = async (req, res) => {
    const status = req.body.action === "APPROVE" ? "approved" : req.body.action === "REJECTED" ? "rejected" : "pending"

    //console.log("Hi",status);
    try {
        const apointment = await appointmentModel.findOneAndUpdate({ _id: req.body.bookingId },{status}).populate([
            {
                path: "userId",
                select: "name email",
                model: userModel
            }, {
                path: "doctorId",
                select: "firstName lastName address specialization feesPerConsultation timings experience",
                model: doctorModel
            }
        ])
        res.status(201).send({
            success: true,
            message: `Appointment is updated as ${status}`,
            data: apointment,
        })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

module.exports = {
    getDoctorInfo,
    updateDoctorInfo,
    getDoctorById,
    doctorAppointments,
    handleApproveBooking
};