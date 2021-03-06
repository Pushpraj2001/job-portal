var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/"+process.env.DATABASE_NAME,
 { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


var jobSchema = new mongoose.Schema({
    company: String,
    name: String,
    location: String,
    experience: String,
    description: String,
    ctc:Number,
    employementType:String,
    ppo:Boolean,
    stipend:Number,
    reqSkills:[String],
    postedBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username:String
  },
    appliedBy: [
      {
       isStatus: String,
       postedBy:
       {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       }
     }]
  },
  {
    timestamps:true, 
  });
  module.exports = mongoose.model("Job", jobSchema);
