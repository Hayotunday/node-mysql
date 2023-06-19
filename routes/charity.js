import express from "express";
import multer from "multer";
import { db } from "../connection.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() })

// all routes in here are starting with /charity

// Charity
router.get('/:id', async (req, res) => {
  const id = req.params.id

  let dbQuery = `select * from ouiadgood.charity where id = '${id}'`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
});

router.get('/', async (req, res) => {
  let dbQuery = `select * from ouiadgood.charity`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
});

router.post('/add', upload.single('image'), async (req, res) => {
  const name = req.body.name;
  const about = req.body.about;
  const url = req.body.url;
  const image = req.file.buffer.toString('base64');
  const heart = 0;

  let dbQuery = `insert into ouiadgood.charity (name,about,heart,image,url) values ('${name}','${about}','${heart}','${image}','${url}')`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)

    dbQuery = `select * from ouiadgood.charity`
    db.query(dbQuery, (err, data) => {
      if (err) return res.json(err)
      return res.json(data)
    })
  })
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  let dbQuery = `delete from ouiadgood.charity where id = '${id}'`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)

    let dbQuery = `select * from ouiadgood.charity`
    db.query(dbQuery, (err, data) => {
      if (err) return res.json(err)
      return res.json(data)
    })
  })
});

// router.delete('/delete-all', async (req, res) => {
//   await col
//     .then(() => { res.json('Deleted all Charity organizations!') })
//     .catch((err) => { console.log(err) })
//   // .catch((err) => { res.status(400).json('Error: ' + err) })
// });

router.patch('/:id', async (req, res) => {
  const name = req.body.name;
  const about = req.body.about;
  const image = req.file.buffer.toString('base64');
  const url = req.body.url;

  let dbQuery = `update ouiadgood.charity set name= '${name}', about='${about}', image='${image}', url='${url}' where id = '${id}'`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)

    let dbQuery = `select * from ouiadgood.charity where name = '${name}'`
    db.query(dbQuery, (err, data) => {
      if (err) return res.json(err)
      return res.json(data)
    })
  })
});

export default router