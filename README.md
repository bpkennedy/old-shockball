# shockball
* [![Build Status](https://travis-ci.org/bpkennedy/shockball.svg?branch=master)](https://travis-ci.org/bpkennedy/shockball)

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.  Server setup based on scaffolding via [this article](http://start.jcolemorrison.com/building-an-angular-and-express-app-part-1/).

# Installation

1. Go to your directory for projects
2. `git clone https://github.com/bpkennedy/shockball.git`
3. `cd shockball`
4. `cd client`
5. `bower install` and then `npm install`
6. `cd ..` and then `cd server`
7. `npm install`

# Local development
`cd` into the `client/` folder and you can do `grunt` to perform a build plus karma tests, and output the finish bundled/minified/compressed files to the `server/dist` folder for deployment.  You can also do `grunt serve` to serve the local client application for normal development.

From `server/` folder you can do `npm test` or `npm start` to use the Node Process with Express to run your `server/dist` folder locally.    

## Testing

Running `grunt test` from `client/` will run the unit tests with karma.

# Deployment
