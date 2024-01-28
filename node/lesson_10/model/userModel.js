const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require("crypto"); //built in node module
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true, //schema type option lowercase transform email into small letter, it schema type option, not a validators
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, //during getting data it will not expose password field to user
  },
  passwordChangedAt: Date,
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not same',
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});
//encrypting password with pre save middleware of mongoose
userSchema.pre('save', async function (next) {
  //we want to encrypt password only if it is created or updated, not on updation of other field like email etc. we do that by knowing if password field is modified not
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12); //12 number of round for salt
  //after hasing new password, we need to delete confirm password.
  this.passwordConfirm = undefined; //we only need confirm for validation to make sure user did not do mistake, in real db we don't need it
  next();
});
userSchema.pre('save', function(next){
  if(!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; //sometime the token is created before data is updated to db we just fix it subtracting 1 second
  //this ensures token has created after password is changed small hack to fix it
  
  next();
});
//adding middleware to prevent loading loading users which are not active -- deleted
userSchema.pre(/^find/, function(next){
  //this points to current query
  this.find({active: {$ne: false}});
  next();
});
userSchema.methods.correctPassword = async function (
  candiatePassword,
  userPassword,
) {
  //this.password is not available due to select : false so we need to pass userPassword to along with candidate password to verify
  return await bcrypt.compare(candiatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10); //base 10 parsing
    //console.log(changedTime, JWTTimestamp);
    return JWTTimestamp < changedTime; // 100 < 200 changed -- 300 < 200 -- not changed
  }
  //False means not changed
  return false;
}
userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minute
  console.log({resetToken}, this.passwordResetToken);
  return resetToken;
}
const User = mongoose.model('User', userSchema);
module.exports = User;
