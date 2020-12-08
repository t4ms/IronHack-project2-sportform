// models/user.js
 
const { Schema, model } = require('mongoose');
 
const playerSchema = new Schema(
  {
    username: String,
    password: String
  },
  {
    timestamps: true
  }
);
 
module.exports = model('Player', playerSchema);
