const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = mongoose.Schema({
        _id : String,
        username: String,
        email: {type: String, required:true, unique: true},
        password: String,
        isBlocked: {type: Boolean, default: false},
        isActive: {type: Boolean, default: false}
    }
);

UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;


