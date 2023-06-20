import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import cors from 'cors';

import { connectToDB, db } from './connection.js';

import usersRoutes from './routes/users.js'
import charityRoutes from './routes/charity.js'
import moneyRoutes from './routes/money.js'

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/charity', charityRoutes);
app.use('/money', moneyRoutes);

connectToDB();

var moneyValue = 0;

if (connectToDB) {
  let totalmoney = moneyValue++;

  let dbQuery = `insert into ouiadgood.money (totalmoney) values ('${totalmoney}')`

  db.query(dbQuery, (err, data) => {
    if (err) return console.log(err)

    dbQuery = `delete from ouiadgood.money where id > 1`
    db.query(dbQuery, (err, data) => {
      if (err) return console.log(err)
    })
  })

  setInterval(async () => {
    dbQuery = `update ouiadgood.money set totalmoney = totalmoney + 0.01 where id = '1'`

    db.query(dbQuery, (err, data) => {
      if (err) return console.error('Failed to increase value:', err)
    })
  }, 10000)
}

app.listen(port, () => console.log(`Server running`))
