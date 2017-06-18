var getCategory = require('./getCategory');

module.exports = function getCollectionList(context, metadata, options) {
  const collection = metadata[getCategory(context, metadata, options)]
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
    })
    .sort((a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();

      return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
    });
  return JSON.stringify(collection);
};