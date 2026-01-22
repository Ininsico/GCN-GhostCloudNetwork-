const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 1000 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'pro' },
    apiKey: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
