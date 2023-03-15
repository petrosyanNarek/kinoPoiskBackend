module.exports = (arr, includeItem, model) => {
  if (includeItem.length > 0) {
    arr.push({ model, ids: includeItem });
  } else {
    arr.push({ model });
  }
  return arr;
};
