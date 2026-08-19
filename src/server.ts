import express from "express";
import { EnvVar } from "./config/EnvVar";
import router from "./routes/routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", router);

app.listen(EnvVar.SERVER_PORT, () => {
    console.log(
        `Servidor rodando em http://localhost:${EnvVar.SERVER_PORT}`
    );
});