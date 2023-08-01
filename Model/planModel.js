import mongoose from "mongoose";

const planSchema = mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    interest: {type: Number, required: true},
    duration: {type: Number, required: true},
},
{
    timestamps: true
}
)

const Plan = mongoose.model("Plan", planSchema)
export default Plan