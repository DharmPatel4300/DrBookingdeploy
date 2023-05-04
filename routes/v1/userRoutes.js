const router  = require('express').Router();


const {
    getUserController,
    applyDoctorController,
    getAllNotificationsAndMarkAllRead,
    deleteAllReadNotifications,
    updateUserController,
    getAllDoctors,
    bookAppointment,
    checkBookingAvailability,
    userAppointments,
} = require("../../controllers/userCtrl");


// USER ROUTES
router.get("/get-user", getUserController) // GET || BYID
router.get("/get-all-doctors", getAllDoctors) // GET ||
router.post("/update-profile", updateUserController) // POST || (UPDATE USER INFO)
router.post("/apply-doctor", applyDoctorController) // POST || (CREATE DOCTOR)
router.post("/get_markread-allnotifications", getAllNotificationsAndMarkAllRead) // POST || (MARK ALL AS READ)
router.post("/delete_allread-notifications", deleteAllReadNotifications) // POST || (DELETE ALL READ NOTIFICATIONS)

router.post("/book-availability", checkBookingAvailability ) // POST || (CHECK APPOINTMENT TIMINGS)
router.post("/book-appointment", bookAppointment ) // POST || (CREATE APPOINTMENT)
router.get("/get-all-appointments", userAppointments ) // GET || (CREATE APPOINTMENT)

module.exports = router;