const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
        required: [true, 'user id required'],
        unique: true
    },
    firstName:{
        type:String,
        required:[true,'first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'last name is required']
    }, 
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    website: {
        type: String,
    },
    address: {
        type: String,
        required: [true, 'address is required']
    },
    specialization: {
        type: String,
        required: [true, 'specialization is required']
    },
    experience: {
        type: Number,
        required: [true, 'experience is required']
    },
    feesPerConsultation: {
        type: Number,
        required: [true, 'fees amount is required']
    },
    timings: {
        type: Object,
        required: [true, 'first name is required']
    },
    status:{
        type:String,
        enum:["pending","active","blocked"],
        default:"pending"
    }
},{timestamps:true}
)

const doctorModel = mongoose.model('doctors',doctorSchema);

module.exports = doctorModel;