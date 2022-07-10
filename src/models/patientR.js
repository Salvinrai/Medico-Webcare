//requiremnets -------------------require



const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const async = require('hbs/lib/async');
const jwt =require('jsonwebtoken');
const res = require('express/lib/response');

// schema --------------registration for patient
const patientRSchema = new  mongoose.Schema({
 name : {
     type:String,
     required:true
 },
 age : {
    type:Number,
    required:true
 },
 sex : {
    type:String,
    required:true
 },
 email : {
    type:String,
    required:true,
    unique:true
 },
 phone : {
    type:Number,
    required:true,
    unique:true
 },
 aadhar : {
    type:String,
    required:true,
    unique:true
 },
 password : {
    type:String,
    required:true
 },

smoke :{
   type:String
},
drink :{
   type:String
},
tabacco :{
   type:String
},
allergy :{
   type:String
},
surgery :{
   type:String
},
info: {
    type:String
},

checkup :[{
    date :{
       type:String
    },
    pname :{
       type:String
    },
    dname :{
      type:String
   },
   view :{
      type:String
   }
}],
medicine :[{
   date :{
      type:String
   },
   patientname :{
      type:String
   },
   prescribedby :{
     type:String
  },
  viewM :{
     type:String
  }
}],

tokens: [{
    token :{
       type:String,
       required:true
    }
 }]
})
//---------------token generation for work modulle for authentication-------
patientRSchema.methods.generateAuthToken = async function(){

   try{
      const token = jwt.sign({_id:this.email}, process.env.SECRET_KEY);
       this.tokens = this.tokens.concat({token:token})
      await this.save();

      return token;
   }
   catch (error){
      res.send('the error part' + error);
      console.log('the error part' + error);

   }
}
//--------------- incription of password---------------
patientRSchema.pre('save', async function(next){
   if(this.isModified('password')){
      console.log(`this password is ${this.password}`);
      this.password = await bcrypt.hash(this.password, 10);
      console.log(`this password is ${this.password}`);
   }
   
   next();
})


// create a collection regarding your patient registration

const registerP = new mongoose.model("Pregister",patientRSchema);

module.exports = registerP;

