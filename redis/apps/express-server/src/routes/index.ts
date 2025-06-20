import express from "express"
import userRouter from "./user.js"
import contentRouter from "./content.js"

const router = express.Router()

router.use("/user",userRouter)
router.use("/content",contentRouter)

export default router