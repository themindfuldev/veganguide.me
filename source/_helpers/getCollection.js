module.exports = function getCollection(context, metadata, options) {
  let collections = context.filter(collection => {
    return collection !== 'articles';
  });
  let collection = metadata[collections[0]]
    .filter(article => {
      return article.path.indexOf('/') !== -1;
    })
    .map(article => {
      return {
        date: article.date.toISOString(),
        image: article.image,
        path: article.path,
        title: article.title,
        contents: article.rawContents
      };
    });
  return JSON.stringify(collection);
};