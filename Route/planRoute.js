import express from 'express'
import { approvePurchase, createPlan, deletePlan, purchasePlan, rejectPurchase, updatePlan, viewAllPlans, viewSinglePlan } from '../Controller/planController.js'
import {protect, admin, user} from '../Middleware/authMiddleware.js'


const router = express.Router()


router.post('/', protect, admin, createPlan)
router.get('/', viewAllPlans)
router.get('/:id', protect, viewSinglePlan)
router.put('/:id', protect, admin, updatePlan)
router.delete('/:id', protect, admin, deletePlan)
router.post('/:id/buy-plan', protect, user, purchasePlan)
router.put('/investment/:id/approve', protect, admin, approvePurchase)
router.put('/investment/:id/reject', protect, admin, rejectPurchase)

export default router   