const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const keysecret = process.env.SECRET_KEY

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
        token: {
            type: String,
            required: true,
        }
    }
  ],
  verifytoken:{
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

// token generate
UserSchema.methods.generateAuthtoken = async function () {
  try {
      let token23 = jwt.sign({ _id: this._id }, keysecret, {
          expiresIn: "1d"
      });

      this.tokens = this.tokens.concat({ token: token23 });
      await this.save();
      return token23;
  } catch (error) {
      return res.status(422).json(error)
  }
}

UserSchema.set('toJSON', {
  transform: function(doc, ret, opt) {
      delete ret['password']
      delete ret['tokens']
      delete ret['verifytoken']
      return ret
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
