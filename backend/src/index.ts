import express from "express";
import morgan from "morgan";
import dotenv from "dotenv"
import cors from "cors";
import helmet from "helmet";
import router from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.disable("x-powered-by");
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.use(helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
    xPoweredBy: false,
}))

app.use('/api/v1',router);

app.listen(port,()=>{
    console.log(`Galaria is running on ${port}`);
})
