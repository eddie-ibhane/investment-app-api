import mongoose from "mongoose";

const investmentSchema = mongoose.Schema(
    {
        plan: {type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true},
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        amount: { type: Number, required: true},
        amountToReceive: { type: Number, required: true},
        startDate: {type: Date},
        endDate: {type: Date},
        isPaid: {type: Boolean, default: false, required: true},
        paidDate: {type: Date},
        rejectedDate: {type: Date},
        status: {type: String, default: "pending", required: true}
    },
    {
        timestamps: true
    }

)

const Investment = mongoose.model("Investment", investmentSchema)

export default Investment