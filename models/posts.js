var mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/"+process.env.DATABASE_NAME, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var postsSchema = new mongoose.Schema({
    heading: String,
    description: String,
    createdAt:{type:Date , default: Date.now},
    postedBy: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },
        companyname: String
    }
});
module.exports = mongoose.model("Posts",postsSchema);