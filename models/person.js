const mongoose = require("mongoose");
require("dotenv").config();
const uniqueValidator = require("mongoose-unique-validator");
mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((res) => console.log("success"))
  .catch((err) => console.log(err));

const personSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true, minlength: 3 },
  number: { type: String, required: true, minlength: 8 },
});
personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("person", personSchema);
