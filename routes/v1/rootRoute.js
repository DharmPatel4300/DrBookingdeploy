const router = require('express').Router();
const userRouter = require('./userRoutes');
const adminRouter = require('./adminRoutes');
const doctorRouter = require('./doctorRoutes');
const {
    loginController,
    registerController,
} = require("../../controllers/authCtrl");

const { getDoctorById } = require('../../controllers/doctorCtrl');

//routes 
//LOGIN || POST
router.post("/login", loginController)


//REGISTER || POST
router.post("/register", registerController)

router.get("/get-doctor", getDoctorById)

// protected routes
const verifyJWT = require('../../middlewares/verifyJWT'); 
router.use(verifyJWT);

router.use("/user", userRouter)
router.use("/admin", adminRouter)
router.use("/doctor", doctorRouter)



module.exports = router;