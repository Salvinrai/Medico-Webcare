//************---------------------requiremants -----------------------------------************
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { stat, truncate } = require('fs');
const app = express()
const http = require('http').createServer(app)
const path = require('path');
const hbs= require('hbs');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const auth = require('./middleware/auth');
const dauth = require('./middleware/dauth');
// const curruser = require('./middleware/auth');
// var Puser = curruser;
// const passport  =require('passport');
// const localStrategy = require('passport-local').Strategy;

// const bodyParser = require('body-parser');
// console.log(Puser);


// ------------------------------connection to database ------------------------
require('./db/connect');

//-----------------------------models to aquire for schema---------------------
const Register = require("./models/patientR");
const DRegister = require("./models/doctorR");

// ------------------------extended requiremnts------------------
const async = require('hbs/lib/async');
const { append, cookie } = require('express/lib/response');

const { json } =require('express');
const { send } = require('process');
const { Console, error } = require('console');


// ----------------------------port local host--------------------
const PORT = process.env.PORT || 4000;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
//------------------path finder--------------------------
const static_path =path.join(__dirname,'../public');

const template_path =path.join(__dirname,'../templates/views');

const partial_path =path.join(__dirname,'../templates/partials');

const main_path =path.join(__dirname,'./com');
console.log(main_path);

//-----------------------------using express json file 
app.use(express.json());
//cookie parser--
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.use(express.static(main_path));
app.use(express.static(__dirname + ''))

// midleware
// app.use(
//     session({
//       secret: "verygoodsecret",
//       resave: false,
//       saveUninitialized: true,
//     })
//   );
//   app.use(bodyParser.urlencoded({ extended: false }));
//   app.use(bodyParser.json());

//------------------handlebars view engine---------------------------
app.set('view engine','hbs');
app.set('views',template_path);
hbs.registerPartials(partial_path);


// //------------------------------- Passport Js-----------------------
// app.use(passport.initialize());
// app.use(passport.session());
// //----serialization and deserialization-----------------
// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   users.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

// let currUser;
// //-----------passport checker------------------ for transfer of curr user to the module------
// passport.use(
//   new localStrategy(function (username, password, done) {
//     Register.findOne({email:username}, function (err, user) {
//       currUser = username;
//       if (err) return done(err);
//       if (!user) return done(null, false, { message: "Incorrect username." });

//       bcrypt.compare(password,user.password, function (err, res) {
//         if (err) return done(err);
//         if (res === false)
//           return done(
//             null,
//             false,
//             { message: "Incorrect password." },
//             console.log("Incorrect Password")
//           );

//         return done(null, user);
//       });
//     });
//   })
// );

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect('login');
// }

// function isLoggedOut(req, res, next) {
//   if (!req.isAuthenticated()) return next();
//   res.redirect('/');
// }

// ------------------server ------register paths ------------------------------
app.get('/', (req,res)=>{
  res.render('mainpage')
});
app.get('/loginD', (req,res)=>{
  res.render('loginD')
});
app.get('/loginP', (req,res)=>{
  res.render('loginP')
});
app.get('/registerP', (req,res)=>{
  res.render('registerP')
});
app.get('/registerD', (req,res)=>{
  res.render('registerD')
});
app.get('/patient',auth, (req,res)=>{
  res.render('patientv')
});
app.get('/patientP',auth, (req,res)=>{
  
  res.render('p-profile',{
    patientname : req.curruser.name,
    age : req.curruser.age,
    Gender : req.curruser.sex,
    email : req.curruser.email,
    Aadhar : req.curruser.aadhar,
    phone : req.curruser.phone,
    smoke : req.curruser.smoke,
    drink : req.curruser.drink,
    tabacco : req.curruser.tabacco,
    allergy : req.curruser.allergy,
    surgery : req.curruser.surgery,
    info : req.curruser.info

  })
});
app.get('/patientP-u',auth, (req,res)=>{

  res.render('p-profile-u')
});
app.get('/patientP-ui',auth, (req,res)=>{
  res.render('p-profile-ui')
});
app.get('/patientP-us',auth, (req,res)=>{
  res.render('p-profile-us')
});
app.get('/patientR',auth, (req,res)=>{
  res.render('patientR')
});
app.get('/patientM',auth, (req,res)=>{
  res.render('patientM')
});
app.get('/patientD',auth,dauth, (req,res)=>{
  res.render('patientD',{
    doctorname : req.currdoctor.name,
    Degree : req.currdoctor.degree,
    Experience : req.currdoctor.Experience,
    handle : req.currdoctor.Phandle,
    info : req.currdoctor.dinfo
  })
});
app.get('/patientDI',auth,dauth, (req,res)=>{
  res.render('patientDI',{
    doctorname : req.currdoctor.name,
    age : req.currdoctor.age,
    sex : req.currdoctor.sex,
    Email : req.currdoctor.email,
    Degree : req.currdoctor.degree,
    Specalist : req.currdoctor.specialist,
    Experience : req.currdoctor.Experience,
    handle : req.currdoctor.Phandle,
    info : req.currdoctor.dinfo
  })
});
app.get('/pCheck',auth, (req,res)=>{
  res.render('pCheck')
});
app.get('/doctorv',dauth, (req,res)=>{
  res.render('doctorv')
});
app.get('/doctorPV',dauth,auth, (req,res)=>{ 
  res.render('doctorPV',{
    patientname : req.curruser.name,
    info : req.curruser.info
  })
});
app.get('/d-profile',dauth, (req,res)=>{ 
  res.render('d-profile',{
    doctorname : req.currdoctor.name,
    age : req.currdoctor.age,
    sex : req.currdoctor.sex,
    Email : req.currdoctor.email,
    Degree : req.currdoctor.degree,
    phone : req.currdoctor.phone,
    Specalist : req.currdoctor.specialist,
    Experience : req.currdoctor.Experience,
    handle : req.currdoctor.Phandle,
    info : req.currdoctor.dinfo
  })
});
app.get('/d-profile-u',dauth, (req,res)=>{ 
  res.render('d-profile-u')
});
app.get('/d-profile-ui',dauth, (req,res)=>{ 
  res.render('d-profile-ui')
});
app.get('/d-profile-us',dauth, (req,res)=>{ 
  res.render('d-profile-us')
});
app.get('/back-d',auth, (req,res)=>{ 
  res.render('patientv')
});
app.get('/back-p',dauth, (req,res)=>{ 
  res.render('doctorv')
});

//------------------- logout work for patient--------------
app.get('/logout', auth , async(req,res) =>{
  try {
       req.curruser.tokens = req.curruser.tokens.filter((currElement) => {
         return currElement.token ===! req.token
        })
        res.clearCookie();
        console.log('logout successful');
        await req.curruser.save();
        res.render('mainpage');
    
  } catch (error) {
    res.status(500).send(error);
  }
});
//------------------- logout work for Doctor--------------
app.get('/logoutd', dauth , async(req,res) =>{
  try {
       req.currdoctor.tokens = req.currdoctor.tokens.filter((currElement) => {
         return currElement.token ===! req.dtoken
        })
        res.clearCookie();
        console.log('logout successful');
        await req.currdoctor.save();
        res.render('mainpage');
    
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get('/consult-d',dauth, (req, res) => {
    res.render('consult-d',{
      doctorname : req.currdoctor.name,
      age : req.currdoctor.age,
      sex : req.currdoctor.sex,
      Email : req.currdoctor.email,
      Degree : req.currdoctor.degree,
      phone : req.currdoctor.phone,
      Specalist : req.currdoctor.specialist,
      Experience : req.currdoctor.Experience,
      handle : req.currdoctor.Phandle,
      info : req.currdoctor.dinfo,
      Aadhar :req.currdoctor.aadhar
      
    });
});
app.get('/consult-p',auth, (req, res) => {
    //res.sendFile(main_path + '/consult-p.html')
    res.render('consult-p',{
      patientname : req.curruser.name,
      age : req.curruser.age,
      Gender : req.curruser.sex,
      email : req.curruser.email,
      Aadhar : req.curruser.aadhar,
      phone : req.curruser.phone,
      smoke : req.curruser.smoke,
      drink : req.curruser.drink,
      tabacco : req.curruser.tabacco,
      allergy : req.curruser.allergy,
      surgery : req.curruser.surgery,
      info : req.curruser.info
  
    });
});

// ------------------server ------register paths **end**------------------------------

// creating a new database for patient registration===> in database
// creating a new database for patient registration===> in database
app.post('/register', async(req,res)=>{
  try{
      const patientRegister = new Register({
       name : req.body.pname,
       age : req.body.age,
       sex : req.body.sex,
       email : req.body.email,
       phone : req.body.phone,
       aadhar : req.body.aadhar,
       password : req.body.password,
      })

      const token =await patientRegister.generateAuthToken();
      console.log('the token part'+ token);
      
      res.cookie('jwt',token,{
        expires:new Date(Date.now()+6000000),
        httpOnly:true
      });

      console.log(cookie);

    const regiatered = await patientRegister.save();
    res.status(201).render('loginP');
  }
  catch(error){
      res.status(400).send(error);

  }
})
// creating a new database for doctor registration===> in database
app.post('/registerD', async(req,res)=>{
   try{
       const DoctorRegister = new DRegister({
        name : req.body.dname,
        age : req.body.dage,
        sex : req.body.dsex,
        email : req.body.demail,
        phone : req.body.dphone,
        aadhar : req.body.daadhar,
        password : req.body.dpassword,
       })

       const token =await DoctorRegister.generateAuthToken();
       console.log('the token part'+ token);
       
       res.cookie('jwtd',token,{
         expires:new Date(Date.now()+6000000),
         httpOnly:true
       });
 
       console.log(cookie);

     const regiatered = await DoctorRegister.save();
     res.status(201).render('loginD');
   }
   catch(error){
       res.status(400).send(error);

   }
})
// checking patient login--------------> from database ------------------
app.post('/patient', async(req,res)=>{
   try{
         const email =req.body.email;
         const password =req.body.password;
    const useremail = await Register.findOne({email:email});

    const isMatch = await bcrypt.compare(password, useremail.password);
    
    const token =await useremail.generateAuthToken();
      console.log('the token part'+ token);
    
      res.cookie('jwt',token,{
        expires:new Date(Date.now()+600000),
        httpOnly:true,
        //secure:true
      });



    if(isMatch){
        res.status(202).render('patientv');
       
             
   }
    else{
       res.send("invalid password details");
   
   }
   }   
   catch(error){
     res.status(404).send("invalid login details");
    }
   });
// checking doctor login--------------> from database ------------------
app.post('/loginD', async(req,res)=>{
   try{
         const email =req.body.email;
         const password =req.body.password;
    const useremail = await DRegister.findOne({email:email});

    const isMatch = await bcrypt.compare(password, useremail.password);
    
    const token =await useremail.generateAuthToken();
      console.log('the token part'+ token);
    
      res.cookie('jwtd',token,{
        expires:new Date(Date.now()+600000),
        httpOnly:true,
        //secure:true
      });
   
    if(isMatch){
        res.status(202).render('doctorv');
       
             
   }
    else{
      res.send("invalid password details");
   
   }
   }  
   
     
   catch(error){
    res.status(404).send("invalid login details");
    }
   });
//-------------------------------patient updation work--------------------
//-----------------------------------updation of patient info ---------------------
app.post('/updateP',auth, (req,res)=>{
   
  console.log(req.curruser.email);
    
  //  Register.findOneAndUpdate(
  //    {email: req.curruser.email},
  //    {
  //      $push :{
  //       name : req.body.pname,
  //       age : req.body.age,
  //       sex : req.body.sex,
  //       email : req.body.email,
  //       phone : req.body.phone,
  //       aadhar : req.body.Aadhar,

  //      },
  //    },
  //    (error, success) =>{
  //      if(error){
  //        console.log(error);
  //      }else{
  //        res.render('patientv');
  //      }
  //    }
  //  );
  Register.findOneAndUpdate({email:req.curruser.email}, 
    {$set:{name : req.body.pname,
            age : req.body.age,
            sex : req.body.sex,
            email : req.body.email,
            phone : req.body.phone,
            aadhar : req.body.Aadhar}},
    function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    }
    else{
      res.render('patientv'); }
   });
  });

//-----------------------------------updation of patient important info ---------------------
app.post('/importantP',auth, (req,res)=>{
  Register.findOneAndUpdate({email:req.curruser.email}, 
    {$set:{info : req.body.message}},
    function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    }
    else{
      res.render('patientv'); }
   });
  });

//-----------------------------------updation of patient important info ---------------------
app.post('/issue',auth, (req,res)=>{
  Register.findOneAndUpdate({email:req.curruser.email}, 
    {$set:{smoke : req.body.smoke,
      drink : req.body.drink,
      tabacco : req.body.tabacco,
      allergy : req.body.allergy,
      surgery : req.body.surgery
    }},
    function(err, doc){
    if(err){
        console.log("Something wrong when updating data!");
    }
    else{
      res.render('patientv'); }
   });
  });


  //-------------------------------patient updation work  **end**--------------------

//-------------------------------doctor updation work  **start**--------------------
  
//---------------------------doctor updation info--------------------
app.post('/updateD',dauth, (req,res)=>{
  DRegister.findOneAndUpdate({email:req.currdoctor.email},
    {$set:{
      name : req.body.dname,
      age : req.body.age,
      sex : req.body.sex,
      email : req.body.email,
      phone :req.body.phone

    }},
    function(err,doc){
      if(err){
        console.log("Something wrong when updating data!");
      }
      else{
        res.render('doctorv'); }
    });
});
//---------------------------doctor work  updation --------------------
app.post('/updatework',dauth, (req,res)=>{
  DRegister.findOneAndUpdate({email:req.currdoctor.email},
    {$set:{
      degree : req.body.Degree,
      specialist : req.body.specialist,
      Experience : req.body.experience,
      Phandle : req.body.handle
    }},
    function(err,doc){
      if(err){
        console.log("Something wrong when updating data!");
      }
      else{
        res.render('doctorv'); }
    });
});
//---------------------------doctor updation important --------------------
app.post('/updateI',dauth, (req,res)=>{
  DRegister.findOneAndUpdate({email:req.currdoctor.email},
    {$set:{
      dinfo : req.body.Dinfo
      
    }},
    function(err,doc){
      if(err){
        console.log("Something wrong when updating data!");
      }
      else{
        res.render('doctorv'); }
    });
});

//-------------------------------doctor updation work  **end**--------------------
//----------------------------------------- Socket---------------------------
//---------------------------------------------communication work 
// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

}) 


//----------comunication work done------------------------
