import express from "express";
import { db } from "../connection.js";

const router = express.Router();

// all routes in here are starting with /users

// User
router.get('/', async (req, res) => {
  let dbQuery = `select * from ouiadgood.users`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  let dbQuery = `select * from ouiadgood.users where id = '${id}'`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
});

router.post('/add', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.email;
  const admin = 0
  const heart = 0
  const referral = 0
  const numberOfReferred = 0

  let dbQuery = `select * from ouiadgood.users where email = '${email}'`

  db.query(dbQuery, (err, data) => {
    if (err) { return res.json(err) }
    else {
      if (data.length === 0) {
        dbQuery = `insert into ouiadgood.users 
            (email,username,password,admin,heart,totalheart,referral,numberOfReferred)
            values
            ('${email}', '${username}','${password}','${admin}','${heart}','${heart}','${referral}','${numberOfReferred}')`


        db.query(dbQuery, (err, data) => {
          if (err) return res.json(err)

          dbQuery = `select * from ouiadgood.users where email = '${email}'`
          db.query(dbQuery, (err, data) => {
            if (err) return res.json(err)
            return res.json(data)
          })
        })
      } else {
        return res.json('<script>alert("Email already exist!. Enter another email that is unique")</script>')
      }
    }
  })
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  let dbQuery = `delete from ouiadgood.users where id = '${id}'`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)
    return res.json(data)
  })
});

router.patch('/', async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;

  let dbQuery = `select * from ouiadgood.users where username = '${username}'`

  db.query(dbQuery, (err, data) => {
    if (err) { return res.json(err) }
    else {
      if (data.length === 0) {
        dbQuery = `update ouiadgood.users set username = '${username}' where email = '${email}'`

        db.query(dbQuery, (err, data) => {
          if (err) return res.json(err)

          dbQuery = `select * from ouiadgood.users where email = '${email}'`
          db.query(dbQuery, (err, data) => {
            if (err) return res.json(err)
            return res.json(data)
          })
        })
      } else {
        return res.json('<script>alert("Username already exist!. Enter another username that is unique")</script>')
      }
    }
  })
});

router.patch('/resetpassword', async (req, res) => {
  await User.updateOne(
    { email: req.body.email },
    { $set: { password: req.body.password } }
  )
  await User.findOne({ email: req.body.email })
    .then((user) => { res.json(user) })
    .catch((err) => { res.status(400).json('Error: ' + err) })
});


// Bookmarks
/*  router.get('/getbookmark/:id', async (req, res) => {
      await User.findById(req.params.id)
        .then((user) => { res.json(user.bookmarks) })
        .catch((err) => { res.status(400).json('Error: ' + err) })
    });

    router.patch('/bookmark', async (req, res) => {
      await User.updateOne(
        { email: req.body.email },
        { $addToSet: { bookmarks: req.body.bookmark } }
      )
        .then((user) => { res.json(user) })
        .catch((err) => { res.status(400).json('Error: ' + err) })
    });

    router.delete('/bookmark/:id', async (req, res) => {
      await User.updateOne(
        { id: req.params.id },
        { $pull: { bookmarks: req.body.bookmark } }
      )
        .then((user) => { res.json(user) })
        .catch((err) => { res.status(400).json('Error: ' + err) })
    });
**/


// Hearts
router.get('/getheart/:id', async (req, res) => {
  const id = req.params.id;

  let dbQuery = `select * from ouiadgood.users where id = '${id}'`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)
    return res.json({ heart: data[0].heart, totalheart: data[0].totalheart })
  })
});

router.patch('/heart', async (req, res) => {
  const heart = req.body.heart;
  const totalheart = req.body.totalheart;
  const email = req.body.email;

  let dbQuery = `update ouiadgood.users set heart = '${heart}', totalheart = '${totalheart}'  where email = '${email}'`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)

    dbQuery = `select * from ouiadgood.users where email = '${email}'`
    db.query(dbQuery, (err, data) => {
      if (err) return res.json(err)
      return res.json(data)
    })
  })
});

router.patch('/donate/:id', async (req, res) => {
  const email = req.body.email
  const heart = req.body.heart
  const id = req.params.id

  let dbQuery = `update ouiadgood.users set heart = heart - ${heart} where email = '${email}'`

  db.query(dbQuery, (err, data) => {
    if (err) return res.json(err)

    dbQuery = `update ouiadgood.charity set heart = heart + ${heart} where id = '${id}'`
    db.query(dbQuery, (err, data) => {
      if (err) return res.json(err)

      dbQuery = `select * from ouiadgood.users where email = '${email}'`
      db.query(dbQuery, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
      })
    })
  })
});

router.patch('/referral', async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;

  let dbQuery = `select * from ouiadgood.users where username = '${username}'`

  db.query(dbQuery, (err, data) => {
    if (err) { return res.json(err) }
    else {
      if (data[0].referral === 0) {
        dbQuery = `update ouiadgood.users set heart = heart + 350, totalheart = totalheart + 350, numberOfReferred = numberOfReferred + 1 where username = '${username}'`

        db.query(dbQuery, (err, data) => {
          if (err) return res.json(err)

          dbQuery = `update ouiadgood.users set referral = '1' where email = '${email}'`

          db.query(dbQuery, (err, data) => {
            if (err) return res.json(err)

            dbQuery = `select * from ouiadgood.users where email = '${email}'`
            db.query(dbQuery, (err, data) => {
              if (err) return res.json(err)
              return res.json(data)
            })
          })
        })
      } else {
        dbQuery = `select * from ouiadgood.users where email = '${email}'`
        db.query(dbQuery, (err, data) => {
          if (err) return res.json(err)
          return res.json(data)
        })
      }
    }
  })

  // const isReferred = await User.findOne({ username: req.body.username });

  // if (!isReferred.referral) {
  //   await User.updateOne(
  //     { username: req.body.username },
  //     { $inc: { heart: 350, totalheart: 350, numberOfReferred: 1 } }
  //   )
  //   await User.updateOne(
  //     { email: req.body.email },
  //     { $set: { referral: true } }
  //   )
  //   await User.findOne({ email: req.body.email })
  //     .then((user) => { res.json(user) })
  //     .catch((err) => { res.status(400).json('Error: ' + err) })
  // } else {
  //   await User.findOne({ email: req.body.email })
  //     .then((user) => { res.json(user) })
  //     .catch(() => { res.status(400).json('Error: ' + err) })
  // }
});

export default router