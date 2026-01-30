import mongoose from "mongoose";
import bcrypt from "bcrypt"; // user package.json has bcrypt, file had bcryptjs. specific to package.json
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, "Minimum Length is 3 characters"],
        maxlength: [30, "Maximum Length is 30 characters"],
        lowercase: true,
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please enter a valid email address'
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8, // Changed to 8 for security (was 0)
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,
    twofactorSecret: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    lastLogin: Date,
    ipAddress: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isActive: 1 });

// Hash Password before Saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 12);
        if (!this.isNew) {
            this.passwordChangedAt = Date.now() - 1000;
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Update passwordChangedAt when password is modified
userSchema.pre('save', function (next) {
    if (!this.isModified('password') && !this.isNew) {
        this.passwordChangedAt = Date.now();
    }
    next();
});

// instance method to check password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimeStamp < changedTimestamp;
    }
    return false;
};

// instance method to create password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    return resetToken;
};

// instance method to create email verification token 
userSchema.methods.createVerificationToken = function () {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    this.verificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    this.verificationTokenExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    return verificationToken;
};

// instance method to check account lock 
userSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// instance method to increment login attempts
userSchema.methods.incrementLoginAttempts = async function () {
    // If lock has expired, reset attempts and lock
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }

    // Otherwise increment
    const updates = { $inc: { loginAttempts: 1 } };

    // Lock if 5th attempt
    if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
    }

    return this.updateOne(updates);
};

// static method to find user by email for login
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email }).select('+password +loginAttempts +lockUntil');
};

// virtual for fullname
userSchema.virtual('fullName').get(function () {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

const User = mongoose.model('User', userSchema);
export default User;
