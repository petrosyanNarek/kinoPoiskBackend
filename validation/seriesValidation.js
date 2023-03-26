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
                isString: true,
                errorMessage: "Film Name is not valid text",
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
            filmId: {
                in: ["body"],
                errorMessage: "Film Id is wrong",
                isInt: true,
                errorMessage: "Film Id is not valid type",
            },
            sezon: {
                in: ["body"],
                errorMessage: "Sezon is wrong",
                isInt: true,
                errorMessage: "Sezon is not valid type",
            },
            part: {
                in: ["body"],
                errorMessage: "Part is wrong",
                isInt: true,
                errorMessage: "Part is not valid type",
            },

        };
    },
};
