module.exports = (value) => {
    return value && Array.isArray(value) ? value : value ? [value] : [];
}