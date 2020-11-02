const express = require("express");
const app = express();
const session = require('express-session')
var cors = require('cors');
const body_parser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const mongoose = require('mongoose');
const port = 4000;
const Bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;

mongoose.Promise = Promise
uri = process.env.MONGO_DB_URI

const dbCollectionName = "users";
const dbCollectionShedule = "work-schedule";

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
  secret: 'cookieSecret logged in Schedule App',
  saveUninitialized: false,
  resave: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    maxAge: Date.now() + (5*60*60*1000)
  }
}))


const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 465,
  service: 'yahoo',
  secure: false,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD
  },
  debug: false,
  logger: true
});



app.all("/*", function(req, res, next){                                                                                 // setup headers for all requests
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.post('/login', (req, res) => {                                                                                     // validate user credentials on login and start session
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
      let user = await mongoose.connection.db.collection(dbCollectionName).findOne({ 'email': req.body.email });
        if(!user) {
          res.json({ message: "The username does not exist", success: false, permissions: '' });
          return
        }

        if(!Bcrypt.compareSync(req.body.password, user.password)) {
          res.json({ message: "The password is invalid", success: false, permissions: '' });
          return
        } else {
          req.session.user = req.body.email
          req.session.save()
          res.json({ message: '', success: !!req.session.user, permissions: user.permissions });
          return
        }
  });
});

app.get('/logout', (req, res) => {                                                                                      // destroy session on logout
  req.session.destroy()
  return
})

app.get('/employee-list', (req, res) => {                                                                               // fetch all users from DB
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
    return await mongoose.connection.db.collection(dbCollectionName).find().toArray(function(err, result) {
          if (err) throw err;
          res.json(result);
    })
  })
})

app.post('/employee-list/delete', (req, res) => {                                                                      // delete a particular user from DB
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
      return await mongoose.connection.db.collection(dbCollectionName).deleteOne(req.body);
  })
});

app.post('/employee-list/edit', (req, res) => {                                                                        // edit details for a particular user
   mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
    return await mongoose.connection.db.collection(dbCollectionName).updateOne({'index': req.body.index}, { $set: req.body });
  })
});

app.post('/employee-list/new', (req, res) => {                                                                         // insert new user record into DB
    req.body.password = Bcrypt.hashSync(req.body.password, 10);
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
      return await mongoose.connection.db.collection(dbCollectionName).insertOne(req.body);
    })
});

app.get('/admin-dashboard', (req, res) => {                                                                           // fetch all users with user permissions
  return mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
    await mongoose.connection.db.collection(dbCollectionName).find({ 'permissions': "user" }).toArray(function(err, result) {
           if (err) throw err;
           res.json(result);
     })
   })
})

app.post('/admin-dashboard', (req, res) => {                                                                          // fetch all work shift records for the next 7 days
  return mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
    await mongoose.connection.db.collection(dbCollectionShedule).find({ 'date': req.body.date }).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    })
  })
})

app.post('/admin-dashboard/new', (req, res) => {                                                                      // insert new work shift record into DB
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
    return await mongoose.connection.db.collection(dbCollectionShedule).insertOne(req.body);
  })
});

app.post('/admin-dashboard/edit', (req, res) => {                                                                     // edit the start time for a particular shift record and send email notification if it was a user request
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
   return await mongoose.connection.db.collection(dbCollectionShedule).updateOne({'date': req.body.date, 'index': req.body.index}, { $set: {'shiftStart': req.body.shiftStart, 'pending': req.body.pending} });
 })

 if (req.body.userEmail != null) {
  var mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: req.body.userEmail,
    subject: 'Shift change request approved',
    html: 'Your request has been approved:<br>Date:<strong>' + req.body.date + '</strong>: <br> New start time: <strong>' + req.body.shiftStart + 'h</strong>'

  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
 }
});

app.post('/admin-dashboard/delete', (req, res) => {                                                                   // delete a particular work shift record
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
      return await mongoose.connection.db.collection(dbCollectionShedule).deleteOne(req.body);
  })
});

app.get('/admin-dashboard/export', (req, res) => {                                                                    // trigger export for all work shift records
  return mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
    await mongoose.connection.db.collection(dbCollectionShedule).find().toArray(function (err, result) {
      if (err) throw err;

      const csvFields = ['date', 'name', 'hours', 'shiftStart'];
      const json2csvParser = new Json2csvParser({ csvFields });
      const csv = json2csvParser.parse(result);

      let date = new Date();
      let exportDate = (date.getDate() + "_" + (date.getMonth() + 1) + "_" + date.getFullYear()).toString()
      fs.writeFile(`exports/schedule_${exportDate}.csv`, csv, function(err) {
        if (err) throw err;
      });

    })
  })
})

app.post('/user-dashboard', (req, res) => {                                                                           // fetch all work shift records for the next 7 days for a particular user
  return mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
    await mongoose.connection.db.collection(dbCollectionShedule).find({ 'date': req.body.date, 'email': req.body.email }).toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    })
  })
})

app.get('/user-dashboard/edit', (req, res) => {                                                                       // fetch list of all users with admin permissions
  return mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
   await mongoose.connection.db.collection(dbCollectionName).find({ 'permissions': "admin" }).toArray(function(err, result) {
          if (err) throw err;
          res.json(result);
    })
  })
})

app.post('/user-dashboard/edit', (req, res) => {                                                                      // request start time change for a particular work shift and send out email notification to a selected admin user
  mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
   return await mongoose.connection.db.collection(dbCollectionShedule).updateOne({'date': req.body.date, 'index': req.body.index}, { $set: {'shiftStart': req.body.shiftStart, 'pending': req.body.pending} });
 })

  var mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: req.body.adminEmail,
    subject: 'Shift change request',
    html: 'Employee ' + req.body.name + 'has requested a new shift start time: <br>Date:<strong>' + req.body.date + '</strong>: <br> New start time: <strong>' + req.body.shiftStart + 'h</strong>'

  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
