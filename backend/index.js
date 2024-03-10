import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {config} from dotenv;
config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

const connect = async () => {
    mongoose.connect(process.env.DB_URL);
    try{
        console.log('Connected to Database');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch(err){
        console.error(`Error connecting to the database: ${err.message}`);
        throw new Error(`Error connecting to the database: ${err.message}`);
    }
}

connect();