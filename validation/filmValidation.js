const { name } = require("./regexpValidation");

module.exports = {
  add: (tableName, isEdit) => {
    return {
      id: isEdit
        ? {
            in: ["body"],
            errorMessage: "Id is wrong",
            isInt: true,
            errorMessage: "Id is not valid type",
          }
        : "",
      name: {
        in: ["body"],
        matches: {
          options: name.reg,
          errorMessage: name.message,
        },
        trim: true,
        isLength: {
          options: { min: 3, max: 20 },
          errorMessage: ` ${tableName} must be between ${3} and 20 haracters`,
        },
      },
      shortDescription: {
        in: ["body"],
        errorMessage: "Short Description is wrong",
        isString: true,
        errorMessage: "Short Description is not valid text",
        isLength: {
          options: { min: 3, max: 50 },
          errorMessage: ` ${tableName} Short Description must be between 3
          and 150 characters`,
        },
        trim: true,
      },
      description: {
        in: ["body"],
        errorMessage: "Description is wrong",
        trim: true,
        isString: true,
        errorMessage: "Description is not valid text",
        isLength: {
          options: { min: 3, max: 50 },
          errorMessage: ` ${tableName} Description must be between 3
           and 150 characters`,
        },
      },
      createdYear: {
        in: ["body"],
        errorMessage: "Created Year is wrong",
        isInt: true,
        errorMessage: "Created Year is not valid type number",
      },
      rating: {
        options: { min: 0, max: 5 },
        in: ["body"],
        errorMessage: "Rating is wrong",
        isInt: true,
        errorMessage: "Rating is not valid type number",
      },
      views: {
        in: ["body"],
        errorMessage: "Views is wrong",
        isInt: true,
        errorMessage: "Views is not valid type number",
      },
      categoryId: {
        in: ["body"],
        errorMessage: "Category Id is wrong",
        isInt: true,
        errorMessage: "category Id is not valid type",
      },
      genres: {
        in: ["body"],
        toArray: true,
        errorMessage: "Genres is not valid type",
      },
      countries: {
        in: ["body.countries.*"],
        isInt: true,
        errorMessage: "countries is not valid type",
      },
      actors: {
        in: ["body.actors.*"],
        isInt: true,
        errorMessage: "actors is not valid type",
      },
      authors: {
        in: ["body.authors.*"],
        isInt: true,
        errorMessage: "authors is not valid type",
      },
    };
  },
};
