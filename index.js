const Metalsmith   = require('metalsmith');
const collections  = require('metalsmith-collections');
const markdown     = require('metalsmith-markdown');
const writemetadata = require('metalsmith-writemetadata');
const permalinks   = require('metalsmith-permalinks');
const assets       = require('metalsmith-assets');
const partials     = require('metalsmith-discover-partials');
const helpers      = require('metalsmith-discover-helpers');
const templates    = require('metalsmith-templates');
const serve        = require('metalsmith-serve');
const console      = require('console');
const exec         = require('child_process').exec;
const fs           = require('fs-extra');

const buildPolymer = () => {
  console.info('Polymer is building web components...');
  exec("cd public; polymer build", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      exec(`osascript -e 'display notification "Error: ${error}" with title "Metalsmith"'`);
      return;
    }
    console.info(`${stdout}`);

    fs.moveSync('public/build/default/components', 'public/components', { overwrite: true });
    fs.moveSync('public/build/default/vendors/polymer', 'public/vendors/polymer', { overwrite: true });    
    fs.moveSync('public/build/default/vendors/l2t-paper-slider', 'public/vendors/l2t-paper-slider', { overwrite: true });
    fs.moveSync('public/build/default/vendors/iron-a11y-keys-behavior', 'public/vendors/iron-a11y-keys-behavior', { overwrite: true });
    fs.moveSync('public/build/default/vendors/fetch', 'public/vendors/fetch', { overwrite: true });
    fs.removeSync('public/build');

    exec(`osascript -e 'display notification "Build complete!" with title "Metalsmith"'`);
  });
};

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
    articles: ['**/*.md', '!index.md'],    
    settings: {
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(writemetadata({
    bufferencoding: 'utf8',
    collections: {
      articles: {
        output: {
          path: 'data/articles.json',
          asObject: true
        },
        ignorekeys: ['next', 'previous', 'mode', 'stats', 'template']
      }
    }
  }))
  .use(function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      var data = files[file];
      data.rawContents = data.contents;
      if (data.collection) {
        data.category = data.collection.find(collection => {
          return collection !== 'articles';
        });
      }
    });
  })
  .use(markdown())
  .use(permalinks({
    relative: false
  }))
  .use(assets({
    source: './source/assets',
    destination: './'
  }))  
  .use(partials({
    directory: 'source/_partials'
  }))
  .use(helpers({
    directory: 'source/_helpers'
  }))
  .use(templates({
    engine: 'handlebars',
    directory: 'source/_layouts'
  }))
  .use(serve({
    port: 8080,
    verbose: true
  }))
  .build(err => {
    if (err) {
      console.log(err);
      exec(`osascript -e 'display notification "Error: ${err}" with title "Metalsmith"'`);
    }
    else {
      buildPolymer();
    }
  });