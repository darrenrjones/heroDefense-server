'use strict'; 

const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({

  username: {type: String, required:true, unique: true},
  password: {type: String, required: true},
  // heroes: {
  //   warrior: {
  //     created: Boolean,
  //     level: Number,
  //     xp: Number
  //   },
  //   hunter: {
  //     created: Boolean,
  //     level: Number,
  //     xp: Number
  //   },
  //   mage: {
  //     created: Boolean,
  //     level: Number,
  //     xp: Number
  //   }
  // }


});

userSchema.set('toObject', {
  transform: function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  }
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);