const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courtSchema = new Schema({
  name: String ,
  date: Date,
  time: Number,
  description: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' } ]
},{
  timestamps: true
});

const Court = mongoose.model('Court', courtSchema);
module.exports = Court;