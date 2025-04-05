import sqlite3 from 'sqlite3'
import express from 'express'

import { sequelize } from './models.js'

const app = express();

app.use((req,res,next)=>{
    console.log('Automatic message');
    next();
});

app.use((req,res,next)=>{
    console.log('Human message');
    res.send({ msg:'hello world' });
});

app.use((req,res,next)=>{
    console.log('Download message');
});

async function startApp() {
    const db = new sqlite3.Database('./tic.db', (err) => {
        if(err) {
            console.log('Error connecting to the database');
            return;
        }
        console.log('Connected to the database');
    });

    await sequelize.sync();

    const port = 3000;

    app.listen(port)
}

startApp();