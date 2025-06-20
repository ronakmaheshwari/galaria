import express from "express"
import userRouter from "./user.js"
import contentRouter from "./content.js"
import linkRouter from "./link.js"

const router = express.Router()

router.use("/user",userRouter)
router.use("/content",contentRouter)
router.use("/share",linkRouter)

export default router