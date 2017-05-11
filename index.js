var Metalsmith   = require('metalsmith');
var collections  = require('metalsmith-collections');
var markdown     = require('metalsmith-markdown');
var permalinks   = require('metalsmith-permalinks');
var assets       = require('metalsmith-assets');
var partials     = require('metalsmith-discover-partials')
var templates    = require('metalsmith-templates');
var serve        = require('metalsmith-serve');
var watch        = require('metalsmith-watch');

Metalsmith(__dirname)
  .metadata({
    sitename: 'Vegan Guide',
    siteurl: 'http://veganguide.me/',
    description: 'An inventive shopping guide for seasoned vegans and vegans-to-be.'
  })
  .source('./source/_posts')
  .destination('./public')
  .clean(true)
  .use(collections({
    articles: {
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(markdown())
  .use(permalinks({
    relative: false
  }))
  .use(assets({
    source: './source/assets',
    destination: './'
  }))  
  .use(partials   ({
    directory: 'source/_partials'
  }))
  .use(templates({
    engine: 'handlebars',
    directory: 'source/_layouts'
  }))
  .use(serve({
    port: 8080,
    verbose: true
  }))
  .use(watch({
    pattern: '**/*',
    livereload: true
  }))
  .build(function(err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Site build complete!');
    }
  });