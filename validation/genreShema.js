const { body } = require("express-validator");
const { text } = require("./regexpValidation");
module.exports = () => {
  return [
    body("name")
      .matches(text)
      .withMessage("Only alphabets are allowed and first letter must been to upper case")
      .isLength({ min: 5, max: 50 })
      .withMessage("Genre must be between 3 and 50 characters"),
  ]
};
