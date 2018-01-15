const mongoose = require('mongoose');
const ProblemSchema = mongoose.Schema({
   id: Number,
   name: String,
   desc: String,
   difficulty: String
});
//model('collectionsName', Schema)
const ProblemModel = mongoose.model('problems', ProblemSchema);
module.exports = ProblemModel;