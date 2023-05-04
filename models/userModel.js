const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'name is required'],
    },
    email:{
        type:String,
        require:[true,"email is required"],
        unique: true
    },
    password:{
        type:String,
        require:[true,'password is required'],
    },
    role:{
        type: String,
        enum: ['DOCTOR', 'USER','ADMIN'],
        default:"USER"
    },
    notifications:{
        type:Array,
        default:[],
    },
    seen_notifications: {
        type: Array,
        default: [],
    },
    status:{
        type: String,
        enum: ["pending", "active", "blocked"],
        default: "active"
    }
})



const userModel = mongoose.model('users',userSchema);

module.exports = userModel;