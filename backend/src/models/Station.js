const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: {
    latitude:  { type: Number, required: true },
    longitude: { type: Number, required: true },
    address:   { type: String, default: '' }
  },
  status:        { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  powerOutput:   { type: Number, required: true },        
  connectorType: { type: String, required: true },        
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Station', StationSchema);