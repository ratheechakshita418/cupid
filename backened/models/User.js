const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  bio: String,
  profilePicture: String,
  location: String,
  interestedIn: {
    type: String,
    enum: ['male', 'female', 'both'],
  },
  personality: {
    mbti: String,
    traits: {
      openness: Number,
      conscientiousness: Number,
      extraversion: Number,
      agreeableness: Number,
      neuroticism: Number,
    },
  },
  questionnaireResponses: [
    {
      questionId: String,
      answer: String,
    },
  ],
  matches: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      status: { type: String, enum: ['like', 'dislike', 'match'] },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  preferences: {
    ageRange: {
      min: Number,
      max: Number,
    },
    distance: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (passwordAttempt) {
  return await bcrypt.compare(passwordAttempt, this.password);
};

module.exports = mongoose.model('User', userSchema);
