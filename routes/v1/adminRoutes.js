const router = require('express').Router();


const {
    getAllDoctors,
    getAllUsers,
    approveDoctorApplicationAndNotifyUser,
    rejectDoctorApplicationAndNotifyUser,
    blockDoctor,
    unblockDoctor,
    blockUser,
    unblockUser,
} = require("../../controllers/adminCtrl");


// USER ROUTES
router.get("/getall-users", getAllUsers ) // GET || BYID
router.post("/block-user", blockUser) // POST || userId in params
router.post("/unblock-user", unblockUser) // POST || userId in params

router.get("/getall-doctors", getAllDoctors) // GET || BYID
router.post("/approve-doctor", approveDoctorApplicationAndNotifyUser ) // POST || doctorId in params
router.post("/reject-doctor", rejectDoctorApplicationAndNotifyUser ) // POST || doctorId in params
router.post("/block-doctor", blockDoctor ) // POST || doctorId in params
router.post("/unblock-doctor", unblockDoctor) // POST || userId in params


module.exports = router;