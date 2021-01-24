const mongoose        = require('mongoose');
var autoIncrement     = require('simple-mongoose-autoincrement');

const UserSchema = new mongoose.Schema({
     
    userId  : { 
      type : Number,
       default : 0
      },
    name  : { 
      type : String,
      required : true,
      maxlength : 50,
    },
    email : { 
      type : String,
      required : true, 
      maxlength : 50, 
    },
    password  : { 
      type : String,
      required : true, 
      minlength : 8, 
    },
    confirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    expires: {
      type: Number,
      default: Date.now()
    },
    activationToken: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Number,
    },
    date  : { 
      type : Date, 
      default : Date.now
    },
      
  });

UserSchema.plugin(autoIncrement , {field : 'userId'});
const Users = mongoose.model('Users', UserSchema);
module.exports = Users;