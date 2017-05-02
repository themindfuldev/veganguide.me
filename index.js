var Metalsmith      = require('metalsmith');
var collections     = require('metalsmith-collections');
var templates         = require('metalsmith-templates');
var markdown        = require('metalsmith-markdown');
var permalinks      = require('metalsmith-permalinks');
var serve           = require('metalsmith-serve');
var watch           = require('metalsmith-watch');

Metalsmith(__dirname)         // __dirname defined by node.js:
                              // name of current working directory
  .metadata({                 // add any variable you want
                              // use them in layout-files
    sitename: 'Vegan Guide',
    siteurl: 'http://veganguide.me/',
    description: 'An inventive shopping guide for seasoned vegans and vegans-to-be.'
  })
  .source('./source/_posts')            // source directory
  .destination('./public')     // destination directory
  .clean(true)                // clean destination before
  .use(collections({
    articles: {
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(markdown())            // transpile all md into html
  .use(permalinks({           // change URLs to permalink URLs
    relative: false           // put css only in /css
  }))
  .use(templates({              // wrap layouts around html
    engine: 'handlebars',     // use the layout engine you like
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
  .build(function(err) {      // build process
    if (err) {
      console.log(err);
    }
    else {
      console.log('Site build complete!');
    }
  });