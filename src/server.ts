import Logger from "../config/logger";
import app from "./app";

// app port
const port = process.env.APP_PORT;

app.listen(port, async () => {
    Logger.info(`Application running on port: ${port}`);
});