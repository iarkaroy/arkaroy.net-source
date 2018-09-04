const SitemapGenerator = require('sitemap-generator');
const URL = 'https://www.arkaroy.net'

// create generator
const generator = SitemapGenerator(URL, {
    maxDepth: 0,
    stripQuerystring: false,
    filepath: './dist/sitemap.xml'
});

// register event listeners
generator.on('done', () => {
    console.log('Sitemap generated');
});

generator.on('add', (url) => {
   console.log('Added to sitemap: ' + url);
});

generator.on('error', console.log);

// start the crawler
generator.start();