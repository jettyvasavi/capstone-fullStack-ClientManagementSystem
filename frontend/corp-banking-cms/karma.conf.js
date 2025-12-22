// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'), // <--- MUST BE HERE
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false
    },
    // --- THIS SECTION CREATES THE REPORT ---
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/corp-banking-cms'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' } // <--- This prints a summary to your terminal
      ]
    },
    reporters: ['progress', 'kjhtml', 'coverage'], // <--- MUST INCLUDE 'coverage'
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true, // <--- Ensures it stops after one run
    restartOnFileChange: true
  });
};
