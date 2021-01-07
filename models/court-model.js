const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courtSchema = new Schema({
  name: String ,
  sport: {
    type: String,
    enum : ['football','tennis','volleyball','basketball','others'],
    required: [true, "This field is required"],
  },
  date: Date,
  startTime: Number,
  endTime: Number,
  description: String,
  location: {
    type: String,
    // required: [true, "This field is required"]
    },
  lng: {
    type: String,
    // required: [true, "This field is required"]
    },
  lat: {
    type: String,
    // required: [true, "This field is required"]
    },
  player: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' } ]
},{
  timestamps: true
});

const Court = mongoose.model('Court', courtSchema);
module.exports = Court;