//importing modules
import express, { json } from "express";
import { connect } from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

//importing routes
import authRoutes from "./routes/auth.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js"
import userRoutes from "./routes/user.routes.js";

//initialising app
const app = express();

//initialising database connection
connect(process.env.DB_CONNECTION)
    .then(() => console.log("Database connected"))
    .catch((error) => console.log(error));

    

//middlewares
const coreOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With, Accept, VERSION",
    exposedHeaders: "Content-Type, Authorization, X-Requested-With, Accept, VERSION",
}
app.use(cors());
app.use(morgan("dev"));
app.use(json())

//registering routes
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/user", userRoutes);


// app.use("/uploads", expressStatic("uploads"));

//listen to server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

