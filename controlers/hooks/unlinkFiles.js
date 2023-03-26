const fs = require("fs");

module.exports = (filPaths) => {
    filPaths.forEach(path => {
        fs.unlink(
            process.cwd() + path,
            (err) => {
                if (err) {
                    return new Error(err);
                }
            }
        );
    });
}