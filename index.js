const Metalsmith   = require('metalsmith');
const collections  = require('metalsmith-collections');
const markdown     = require('metalsmith-markdown');
const permalinks   = require('metalsmith-permalinks');
const assets       = require('metalsmith-assets');
const partials     = require('metalsmith-discover-partials')
const templates    = require('metalsmith-templates');
const serve        = require('metalsmith-serve');
const watch        = require('metalsmith-watch');
const console      = require('console');
const exec         = require('child_process').exec;
const fs           = require('fs-extra');

const buildPolymer = () => {
  console.log('building polymer...');
  exec("cd public; polymer build --js-compile", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`${stdout}`);

    fs.moveSync('public/build/default/components', 'public/components', { overwrite: true });
    fs.moveSync('public/build/default/vendors/polymer', 'public/vendors/polymer', { overwrite: true });
    fs.moveSync('public/build/default/vendors/l2t-paper-slider', 'public/vendors/l2t-paper-slider', { overwrite: true });
    fs.moveSync('public/build/default/vendors/iron-a11y-keys-behavior', 'public/vendors/iron-a11y-keys-behavior', { overwrite: true });
    fs.removeSync('public/build');
    console.log('Site build complete!');
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
  .use(partials({
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
  .build(err => {
    if (err) {
      console.log(err);
    }
    else {
      buildPolymer();
    }
  });