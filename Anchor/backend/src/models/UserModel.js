import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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
        minlength: 0,
        select: false
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerified: {
        type: Boolean,
        default: false
    },
    verificationtoken: String,
    verficationtokenExpires: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    loginAttempt: {
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
    lastlogin: Date,
    ipAddress: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isActive: 1 });

//Hash Password before Saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 12);
        if (!this.isNew) {
            this.passwordChangeAt = Date.now() - 1000;
        }
        next();
    } catch (error) {
        next(error);
    }
});
//Update passwordChangeAt when password is modified
userSchema.pre('save', function (next) {
    if (!this.isModified('password') && !this.isNew) {
        this.passwordChangeAt = Date.now();
    }
    next();
});
//instance method to check password
userSchema.methods.correctpassword = async function (candidatepassword, userpassword) {
    return await bcrypt.compare(candidatepassword, userpassword);
}
//instance method to check if password was changed after token was issued
userSchema.methods.changepasswordafter = function (JWTTimeStamp) {
    if (!this.passwordChangeAt) {
        const changedtimestamp = parseInt(
            this.passwordChangeAt.getTime() / 1000,
            10
        );
        return JWTTimeStamp < changedtimestamp;
    }
    return false;
};
//instance method to create password reset token
userSchema.methods.createpasswordresttoken = function () {
    const resettoken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resettoken)
        .digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;//10 mins bruv u only got 10 min to reset the shi or else bomb blasts
    return resettoken;
}
//instance method to create emailverificationtoken 
userSchema.methods.createVerificationToken = function () {
    const verificationtoken = crypto.randomBytes(32).toString('hex');
    this.verificationtoken = crypto
        .createHash('sha256')
        .update(verificationtoken)
        .digest('hex');
    this.verificationtokenExpires = Date.now() + 10 * 60 * 1000; //U GOT AGAIN 10 MINS HOMIE BOYE
    return verificationtoken;
};

//instance method to check account lock 
userSchema.methods.isLocked = function () {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempt: 1 },
            $unset: { lockUntil: 1 }
        });
    }
    const updates = { $inc: { loginAttempt: 1 } };
    if (!this.loginAttempt + 1 >= 5 && !this.isLocked()) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }//2hours
    }
    return this.updateOne(updates);
};

//static method to find user by email for login
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email }).select('+password +loginAttempts +lockUntil');
};

//virtual for fullname
userSchema.virtual('fullname').get(function () {
    return `${this.firstName} ${this.lastName}`.trim();
});
const User = mongoose.model('User', userSchema);
export default User;
