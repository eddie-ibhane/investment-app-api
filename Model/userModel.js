import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    password: {type: String},
    address: {type: String},
    wallet: {type: Number,default: 0, required: true},
    refCode: {type: String},
    image: {type: String}

},
{
    timestamps: true
}
)

const User = mongoose.model("User", userSchema)


export default User