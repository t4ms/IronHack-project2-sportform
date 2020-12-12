const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courtSchema = new Schema({
  name: { type: String },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' } ]
})

const Court = mongoose.model('Court', courtSchema);
module.exports = Court;