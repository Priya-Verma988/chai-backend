import mongoose, {Schema} from "mongoose";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

     email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
     fullname: {
        type: String,
        required: true,
        trim: true,
        index: true // READ INDEXING IN DATABASE most importantly
    },
    avatar:{
        type: String,
        required: true
    },
    coverImage: {
        type: String
    },
    watchHistory:[
        {
        type:Schema.Types.ObjectId,
        ref: "Vedio"
        }
    ],
    passward:{
        type: String,
        required: [true, 'Passward is required']
    },
    refreshToken:{
        type: toString
    }


}, {timestamps: true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("passward")) return next();

    this.passward = await bcrypt.hash(this.passward, 10) 
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRECT,
        {
           expiredIn: process.env.ACCESS_TOKEN_EXPIRY 
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiredIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);