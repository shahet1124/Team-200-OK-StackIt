const mongoose = require('mongoose');

const PermissionGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String, required: true }]
});

module.exports = mongoose.model('PermissionGroup', PermissionGroupSchema); 