const mongoose = require('mongoose'),
      validator = require('validator'),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
      firstname: {
				type: String,
				required: true,
				minlength: 2
			},
			
			lastname: {
				type: String,
				required: true,
				minlength: 2
			},

			email: {
				type: String,
				required: true,
				trim: true,
				minlength: 8,
				unique: true,
				validate: {
					validator: validator.isEmail,
					message: '{VALUE} is not a valid email'
				}
			},

			password: {
				type: String,
				required: true,
				minlength: 6
			},

			photo: String,

			tokens: [{
				token: {
					type: String,
					required: true
				}
			}
			],

			blogPosts: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'blogPost'
			}]

});

UserSchema.methods.generateAuthToken = function() {
	let user = this;
	let token = jwt.sign(
		{ _id: user._id.toHexString()},
		process.env.SECRET,
		{expiresIn: 60 * 60 * 24 * 7}
	).toString();

	user.tokens.push({token});

	return user.save().then(() => token);
};

UserSchema.statics.findByToken = function(token) {
	let User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, process.env.SECRET);
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.token': token
	});
};

// for login
UserSchema.findByCredentials = function(email, password) {
	let User = this;
	return User.findOne({
		email
	}).then(user => {
		if(!user) {
			return Promise.reject();
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if(res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};

// get number of posts per user
UserSchema.virtual('postCount').get(function() {
	let user = this;
	return user.blogPots.length;
});

UserSchema.pre('save', function(next) {
	let user = this;

	if(user.isModified('password')) {
		bcrypt.genSalt(20, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

UserSchema.pre('remove', function(next) {
	let User = this;

	const BlogPost = mongoose.model('blogPost');
	BlogPost.remove({_id: {$in: User.blogPosts }}).then(() => next());
});

const User = mongoose.model('user', UserSchema);

module.exports = {User};
