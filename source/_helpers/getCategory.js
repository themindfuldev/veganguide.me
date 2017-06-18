module.exports = function getCollection(context, metadata, options) {
  let collections = context.filter(collection => {
    return collection !== 'articles';
  });
  return collections[0];
};