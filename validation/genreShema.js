const { checkSchema, validationResult } = require("express-validator");

module.exports = () => {
  console.log("klk");
  return checkSchema({
    name: {
      in: ["body"],
      isString: {
        errorMessage: "Genres name  should be at a string ",
      },
      isLength: {
        errorMessage: "Genres name should be at least 3 chars long",
        options: { min: 3 },
      },
    },
  });
};
