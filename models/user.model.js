// models/user.js
 
const { Schema, model } = require('mongoose');
 
const userSchema = new Schema(
  {
    email: String,
    password: String,
    firstname: String,
    lastname: String
  },
  {
    timestamps: true
  }
);
 
module.exports = model('User', userSchema);
