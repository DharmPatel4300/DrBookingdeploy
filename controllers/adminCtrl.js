const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');




const getAllUsers = async (req, res) => {
    const { id } = req.body;
    try {
        //get admin
        let admin = await userModel.findById(id);

        if(!admin){
            return res.status(403).send({ message: "Unautorized request", success: false })
        }
        
        const users = await userModel.find({ role: "USER" }, { name:1, email:1,status:1 })
        
        res.status(201).send({ message: "All user recived !", success: true, data:users })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

const getAllDoctors = async (req, res) => {
    const { id } = req.body;
    try {
        //get admin
        let admin = await userModel.findById(id);
        
        if (!admin) {
            return res.status(403).send({ message: "Unautorized request", success: false })
        }

        const doctors = await doctorModel.find({}).populate("userId", "email" )

        res.status(201).send({ message: "All dotors recived !", success: true, data:doctors })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

const approveDoctorApplicationAndNotifyUser = async (req, res) => {
    const { id } = req.body;
    const { doctorId } = req.query;
    try {
        //get admin
        let admin = await userModel.findById(id);

        if (!admin) {
            return res.status(403).send({ message: "Unautorized request", success: false })
        }

         const doctor = await doctorModel.findOneAndUpdate({ _id: doctorId },{status:"active"}).populate("userId", "email")

        
        
        const userNotification = {
            type: "request-doctor-application-accepted",
            message: "Congratulations!, Your request has been approved",
            data: {
                onClickPath: "/notifications",
            }
        }
        
        const updatedUser = await userModel.findByIdAndUpdate(
            doctor.userId._id,
            { $push: { notifications: userNotification }, role: "DOCTOR" }
        );
        const user = {
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name,
            notifications: updatedUser.notifications,
            seen_notifications: updatedUser.seen_notifications,
        }

        res.status(201).send({ message: `${doctor.name} is assigned as doctor`, success: true })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

const rejectDoctorApplicationAndNotifyUser = async (req, res) => {
    const { id } = req.body;
    const { doctorId } = req.query;
    try {
        //get admin
        let admin = await userModel.findById(id);

        if (!admin) {
            return res.status(403).send({ message: "Unautorized request", success: false })
        }

        const doctor = await doctorModel.findOneAndRemove({ _id: doctorId });

        const userNotification = {
            type: "request-doctor-application-rejected",
            message: "Sorry!, Your request has been rejected",
            data: {
                onClickPath: "/notifications",
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            doctor.userId,
            { $push: { notifications: userNotification } }
        );
        const user = {
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name,
            notifications: updatedUser.notifications,
            seen_notifications: updatedUser.seen_notifications,
        }

        res.status(201).send({ message: `${user.name} 's rejected as doctor`, success: true, data: user })

    } catch (error) {
        //console.log("from here",error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

const blockDoctor = async (req, res) => {
    const { id } = req.body;
    const { doctorId } = req.query;
    try {
        //get admin
        let admin = await userModel.findById(id);

        if (!admin) {
            return res.status(403).send({ message: "Unautorized request", success: false })
        }

        const doctor = await doctorModel.findOneAndUpdate({ _id: doctorId }, { status: "blocked" }).populate("userId", "email")



        const userNotification = {
            type: "doctor-account-blocked",
            message: "Sorry!, Your doctor acc has been blocked",
            data: {
                onClickPath: "/notifications",
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            doctor.userId._id,
            { $push: { notifications: userNotification },role:"USER" }
        );
        const user = {
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name,
            notifications: updatedUser.notifications,
            seen_notifications: updatedUser.seen_notifications,
        }

        res.status(201).send({ message: `${doctor.firstName} is blocked as doctor`, success: true })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

const unblockDoctor = async (req, res) => {
    const { id } = req.body;
    const { doctorId } = req.query;
    try {
        //get admin
        let admin = await userModel.findById(id);

        if (!admin) {
            return res.status(403).send({ message: "Unautorized request", success: false })
        }

        const doctor = await doctorModel.findOneAndUpdate({ _id: doctorId }, { status: "active" }).populate("userId", "email")



        const userNotification = {
            type: "doctor-account-unblocked",
            message: "Congratulations!, Your doctor acc has been unblocked",
            data: {
                onClickPath: "/notifications",
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            doctor.userId._id,
            { $push: { notifications: userNotification }, role: "DOCTOR" }
        );
        const user = {
            email: updatedUser.email,
            role: updatedUser.role,
            name: updatedUser.name,
            notifications: updatedUser.notifications,
            seen_notifications: updatedUser.seen_notifications,
        }

        res.status(201).send({ message: `${doctor.name} is unblocked as doctor`, success: true })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

const blockUser = async (req, res) => {
    const { id } = req.body;
    const { userId } = req.query;
    try {
        //get admin
        let admin = await userModel.findById(id);

        if (!admin) {
            return res.status(403).send({ message: "Unautorized request", success: false })
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { status:"blocked" }
        );

        res.status(201).send({ message: `${updatedUser.name} is blocked as user`, success: true })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}

const unblockUser = async (req, res) => {
    const { id } = req.body;
    const { userId } = req.query;
    try {
        //get admin
        let admin = await userModel.findById(id);

        if (!admin) {
            return res.status(403).send({ message: "Unautorized request", success: false })
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { status: "active" }
        );

        res.status(201).send({ message: `${updatedUser.name} is unblocked as user`, success: true })

    } catch (error) {
        //console.log(error);
        res.status(500).send({ message: "Internal Server Error", success: false })
    }
}



module.exports =
{
    getAllUsers,
    getAllDoctors,
    approveDoctorApplicationAndNotifyUser,
    rejectDoctorApplicationAndNotifyUser,
    blockDoctor,
    unblockDoctor,
    blockUser,
    unblockUser,

};