require("dotenv").config();

const cors =require("cors")
const express = require("express");
const app = express();

const dbConfig = require("./dbConfig/dbCongfig.js");


app.use(cors({

    origin: process.env.CORS_ORIGIN,
    credentials:true,
    //ready npm cors doc
}))


app.use(express.json());

const userRoute = require("./routes/userRoute.js");
const todoRoute = require("./routes/todoRoute.js")

app.use("/api/users", userRoute);
app.use("/api/todos", todoRoute); 


const port = process.env.PORT;

app.listen(port, () => console.log(`Listing on port ${port}`));
