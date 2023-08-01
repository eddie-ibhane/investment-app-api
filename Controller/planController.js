import Investment from "../Model/investmentModel.js"
import Plan from "../Model/planModel.js"
import User from "../Model/userModel.js"

// Create plan - Admin only
const createPlan = async(req, res) => {
    try {
        const {name, price, duration, interest} = req.body
        const newPlan = await new Plan({
            name, 
            price, 
            duration,
            interest
        })
        const savePlan = await newPlan.save()
        if (savePlan) {
            res.json({status: true, message: "Plan created successfully"})
        } else {
            res.status(400).json({status: false, message: "Unable to create a plan"})
        }
    } catch (error) {
        throw new Error(error)
    }
}

// get all plan - public
const viewAllPlans = async(req, res) => {
    try {
        const plans = await Plan.find({})
        if (plans.length > 0 ) {
            res.json({status: true, message: "Plans fetched successfully", plans})
        } else {
            res.status(400).json({status: false, message: "Plans not found"})
        }
    } catch (error) {
        throw new Error(error)
    }
}

// get a single plan by id
const viewSinglePlan = async(req, res) => {
    try {
        const plan = await Plan.findById(req.params.id)
        // const plan = await Plan.findById({_id: req.params.id})
        if (plan) {
            res.json({status: true, message: "Plan fetched successfully", plan})
        } else {
            res.status(400).json({status: false, message: "Plan not found"})
        }
    } catch (error) {
        throw new Error(error)
    }
}

// update a single plan by id
const updatePlan = async(req, res) => { 
    try {
        const {name, price, interest, duration} = req.body
        const plan = await Plan.findById(req.params.id)
        if (plan) {
            const updatePlan = await Plan.findByIdAndUpdate(plan._id, {
                name: name ? name : plan.name,
                price : price ? price : plan.price,
                interest: interest ? interest : plan.interest,
                duration: duration ? duration : plan.duration
            }, {new: true, useFindAndModify: false})
            if (updatePlan) {
                res.json({status: true, message: "Plan updated successfully", updatePlan})
            } else {
                res.status(400).json({status:false, message: "Unable to update plan"})
            }
        } else {
            res.status(400).json({status: false, message: "Plan not found"})
        }
    } catch (error) {
        throw new Error(error)
    }
}

// delete a single plan by id
const deletePlan = async(req, res) => {
    try {
        const plan = await Plan.findById(req.params.id)
        if (plan) {
            const deletePlan = await Plan.findByIdAndDelete(plan._id)
            if (deletePlan) {
                res.json({status: true, message: "Plan deleted successfully"})
            } else {
            res.status(400).json({status:false, message: "Unable to delete plan"})
            }
        } else {
            res.status(400).json({status:false, message: "Plan not found"})
        }
    } catch (error) {
        throw new Error(error)
    }
}

// get a single plan by id
const purchasePlan = async(req, res) => {
    try {
        const plan = await Plan.findById(req.params.id)
        if (plan) {
            const amountToReceive = ((100 + plan.interest)/100) * plan.price
            if (req.user.wallet >= plan.price) {
                const newInvestment = await new Investment({
                    plan: plan._id,
                    user: req.user,
                    amount: plan.price,
                    amountToReceive
                })
                const savedInvestment = await newInvestment.save()
                if (savedInvestment) {
                    const newBalance = req.user.wallet - plan.price
                    await User.findByIdAndUpdate(req.user._id, {
                        wallet: newBalance
                    }, {
                        new: true, useFindAndModify: false
                    })
                    res.json({status: true, message: "Plan initiated purchase successfully", plan, savedInvestment})
                } else {
                    res.status(400).json({status: false, message: "Unable to initialize the purchase of your plan"})
                }
            }else{
                res.status(400).json({status: false, message: "Wallet balance is not sufficient to purchase plan"})
            }
        } else {
            res.status(400).json({status: false, message: "Plan not found!"})
        }
    } catch (error) {
        throw new Error(error)
    }
}

// Accept Purchase
const approvePurchase = async(req, res) => {
    try {
        const investment = await Investment.findOne({_id: req.params.id, status: "pending"})
        if (investment) {
            const plan = await Plan.findOne({_id: investment.plan})
            const today = new Date()
            const endDate = new Date(today)
            endDate.setDate(today.getDate() + plan.duration)
            const approve = await Investment.findByIdAndUpdate(investment._id, {
                status: "approved",
                isPaid: true,
                StartDate: today,
                endDate,
                paidDate: today
            },{
                new: true,
                useFindAndModify: false
            })
            if (approve) {
                res.json({status: true, message: "Investment updated to paid", investment})
            } else {
                res.status(400).json({status: false, message: "Unable to upate investment to paid"})
            }
        } else {
            res.status(400).json({status: false, message: "No pending investment found"})
        }
    } catch (error) {
        throw new Error(error)
    }
}

// Reject Purchase
const rejectPurchase = async(req, res) => {
    try {
        const investment = await Investment.findOne({_id: req.params.id, status: "pending"})
        if (investment) {
            const today = new Date()
            const reject = await Investment.findByIdAndUpdate(investment._id, {
                status: "rejected",
                rejectedDate: today
            }, {
                new: true, useFindAndModify: false
            })
            if (reject) {
                const plan = await Plan.findOne({_id: investment.plan})
                const user = await User.findOne({_id: investment.user})
                const newBalance = user.wallet + plan.price
                    await User.findByIdAndUpdate(user._id, {
                        wallet: newBalance
                    }, {
                        new: true, useFindAndModify: false
                    })
                res.json({status: true, message: "Investment rejected", investment})
            } else {
                res.status(400).json({status: false, message: "Unable to update your investment to rejected"})
            }
        } else {
            res.status(400).json({status: false, message: "No pending investment found!"})
        }
    } catch (error) {
        throw new Error(error)
    }
}

export {createPlan, viewAllPlans, viewSinglePlan, updatePlan, deletePlan, purchasePlan, approvePurchase, rejectPurchase}