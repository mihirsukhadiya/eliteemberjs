'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
      fingerprint: {
        enabled: false
      },
      vendorFiles: {
        'bootstrap.js': {
          development: 'node_modules/bootstrap/dist/js/bootstrap.js',
          production: 'node_modules/bootstrap/dist/js/bootstrap.min.js'
        }
      },
      svgJar: {
        optimizer: {
          sourceDirs: ['/svgs'],
          plugins: [
            { removeViewBox: false },
            { removeXMLProcInst: true },
            { removeComments: true },
            { removeMetadata: true },
            { removeEditorsNSData: true },
            { removeHiddenElems: true },
            { removeEmptyText: true },
            { removeEmptyAttrs: true },
            { removeEmptyContainers: true },
            { removeUnusedNS: true },
            { removeTitle: false },
            { removeDesc: false },
            { removeUselessDefs: true },
            { removeUnknownsAndDefaults: true },
            { removeNonInheritableGroupAttrs: true },
            { removeUselessStrokeAndFill: true },
            { cleanupAttrs: true },
            { convertStyleToAttrs: true },
            { cleanupIDs: false },
            { cleanupNumericValues: true },
            { cleanupEnableBackground: true },
            { convertColors: true },
            { convertShapeToPath: true },
            { moveElemsAttrsToGroup: true },
            { moveGroupAttrsToElems: true },
            { collapseGroups: true },
            { convertPathData: true },
            { convertTransform: true },
            { mergePaths: true },
            { minifyStyles: true },
            {
              inlineStyles: {
                onlyMatchedOnce: false,
                removeMatchedSelectors: true
              }
            }
          ]
        }
      }
  });
  app.import('vendor/font-awesome/font-awesome.min.css');
  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
