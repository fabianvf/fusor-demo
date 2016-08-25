# fusor-demo

Install node.js version 6.4
[nvm](https://github.com/creationix/nvm) is one easy way to accomplish this:
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.6/install.sh | bash
nvm install 6.4
nvm use 6.4
```

build the review app from inside the lib/review directory
```
cd lib/review
npm install
./node_modules/webpack/bin/webpack.js --config ./config/webpack.dev.js
```

return to the fusor-demo dir
```
cd ../..
```

and build and run the main app
```
npm install
npm start
```
