import express from "express";
import { db } from "../connection.js";

const router = express.Router();

// all routes in here are starting with /money

// Money
router.get('/', async (req, res) => {
  let dbQuery = `select * from ouiadgood.money`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
});

export default router