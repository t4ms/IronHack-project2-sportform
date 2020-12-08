// models/user.js
 
const { Schema, model } = require('mongoose');
 
const playerSchema = new Schema(
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
 
module.exports = model('Player', playerSchema);
