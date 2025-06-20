import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/index.js"

dotenv.config()

const app = express()
const port = process.env.PORT

app.disable("x-powered-by");
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
app.use(helmet({
    contentSecurityPolicy: true,
    xDownloadOptions: false,
    xPoweredBy: false,
}))

app.use("/api/v1",router)

app.listen(port,()=>{
    console.log(`Express is running on ${port}`)
})