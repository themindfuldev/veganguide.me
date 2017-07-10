# veganguide.me-source
veganguide.me source code

```
npm install
bower install
node index
```

To deploy:

http://krishicks.com/post/subtree-gh-pages/

```
rm -rf public
git subtree add --prefix public origin gh-pages
...
npm run deploy
```

Requires polymer-cli@1.3.1+, node 8.1.3+ and npm 5.1.0+