const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const rideSchema = new Schema({
  pickup_location: { type: [Number], index: '2d', required: true },
  arrival_location: { type: [Number], index: '2d', required: true },
  price: { type: Number, default: 0, required: true },
  user: { type: ObjectId, ref: 'users', required: true }
});

const Rides = mongoose.model('rides', rideSchema);

module.exports = Rides;
