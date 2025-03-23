const mongoose = require("mongoose");
const bycript = require('bcrypt')
const developerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  work: {
    type: String,
    enum: ["fullstack", "frontend", "backend"],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }
});

developerSchema.pre('save', async function(next) {

  const developer = this;

  if(!developer.isModified('password')) return next();

  try {
    const salt = await bycript.genSalt(10);

    const hashedPassword = await bycript.hash(developer.password, salt);

    developer.password = hashedPassword;
  } catch (error) {
    throw error;
  }
})


developerSchema.method.comparePassword = async function(candidatePassword) {

  try{
    const isMatch = await bycript.compare(candidatePassword , this.password);

    return isMatch;

  }catch(error){

    throw error

  }
  
}

const Developer = mongoose.model('Developer', developerSchema);


module.exports = Developer;