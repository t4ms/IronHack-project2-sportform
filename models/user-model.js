const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  }
  ,
  fullName: {
    type: String,
    required: [true, 'Your Fullname is required.']
  },
  // slack:
  slackID: String,
  // google
  googleID: String
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
