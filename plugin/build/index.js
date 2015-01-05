var path = require('path');

var BASE_DIRECTORY = path.join(__dirname, '..', '..');
var IMAGES_DIRECTORY = path.join(BASE_DIRECTORY, 'images');

exports.getResourceDirectories = function (api, app, config, cb) {
  var dirs = [{
    src: IMAGES_DIRECTORY,
    target: 'images/'
  }];
  return dirs;
};
