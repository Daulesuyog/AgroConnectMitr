// import db from "./Models/AgroConnectMitr.js";
// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import farmerRouter from "./Routes/farmerRoutes.js"
// import workerRouter from "./Routes/workerRoutes.js";
// import jobRouter from "./Routes/jobsRoutes.js";
// import openaiRouter from "./Routes/openaiRoute.js";
// import applicationRouter from "./Routes/applicationRouter.js";
// import payementRouter from "./Routes/paymentRotes.js";
// import Contact from "./Routes/contactRouter.js";;

// const app = express();
// const port = 3000;

// app.use(express.urlencoded({extended:true}));
// app.use(bodyParser.json());

// app.use(cors({
//   origin: 'http://localhost:5173', // ✅ Exact frontend URL
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use("/api/farmer", farmerRouter);
// app.use("/api/worker", workerRouter);
// app.use("/api/job", jobRouter);
// app.use("/api/application", applicationRouter);
// app.use("/api/openai", openaiRouter);
// app.use("/api/payment", payementRouter);
// app.use("/api/contact", Contact);


// app.listen(port,  () => {
//     try {
//        db.connect();
//         console.log("Connected to the database successfully ✅");
//         console.log(`Server is running on port ${port} 🚀`);
//     } catch (error){
//         console.error("Error connecting to the database ❌:", error);
//     }
// });

import db from "./Models/AgroConnectMitr.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import farmerRouter from "./Routes/farmerRoutes.js";
import workerRouter from "./Routes/workerRoutes.js";
import jobRouter from "./Routes/jobsRoutes.js";
import openaiRouter from "./Routes/openaiRoute.js";
import applicationRouter from "./Routes/applicationRouter.js";
import payementRouter from "./Routes/paymentRotes.js";
import Contact from "./Routes/contactRouter.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: [
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use("/api/farmer", farmerRouter);
app.use("/api/worker", workerRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);
app.use("/api/openai", openaiRouter);
app.use("/api/payment", payementRouter);
app.use("/api/contact", Contact);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
db.connect()
  .then(() => {
    console.log("Connected to the database successfully ✅");

    app.listen(port, () => {
      console.log(`Server is running on port ${port} 🚀`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed ❌", err);
  });