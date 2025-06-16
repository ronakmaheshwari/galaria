import express from "express"
import userRouter from "./user";
import contentRouter from "./content";
import shareRouter from "./link";

const router = express.Router();

router.use("/user",userRouter);
router.use("/content",contentRouter);
router.use("/share",shareRouter);

export default router;