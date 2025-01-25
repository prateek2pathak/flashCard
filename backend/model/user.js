import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        unique: true, //ensures no unique in collection
        trim: true, //removes any trailing spaces
        lowercase: true, //converts it to lowercase before saving,
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        enum: ['student','admin']
    }

})

export default mongoose.model('UserSchema',userSchema);
