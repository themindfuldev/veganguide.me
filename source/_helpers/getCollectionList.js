module.exports = function getCollectionList(metadata, shouldFilterItself, options) {
  let collection = [];
  if (metadata.category) {
    collection = metadata[metadata.category]
      .filter(article => {
        let shouldFilter = article.path.indexOf('/') !== -1;
        if (shouldFilterItself) {
          shouldFilter &= article.path !== metadata.path;
        }
        return shouldFilter;
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
  }
  return JSON.stringify(collection);
};