const router = require('express').Router();

const { 
    getDoctorInfo, 
    updateDoctorInfo, 
    doctorAppointments, 
    handleApproveBooking, 
} = require('../../controllers/doctorCtrl');


//GET DOC INFO
router.get("/get-profile",getDoctorInfo);
router.get("/get-all-appointments", doctorAppointments);
router.get("/get-profile", doctorAppointments);
router.post("/update-profile", updateDoctorInfo);
router.post("/approve-booking", handleApproveBooking);

module.exports = router;