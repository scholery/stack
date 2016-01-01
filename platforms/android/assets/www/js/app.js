// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('stacks', ['ionic', 'stacks.controllers', 'stacks.services'])

.run(function($ionicPlatform,StacksDB) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)   
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //init db
    StacksDB.initDB();
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom'); // other values: top 
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

    .state('tab.stacks', {
      url: '/stacks',
      views: {
        'tab-stacks': {
          templateUrl: 'templates/tab-stacks.html',
          controller: 'StacksCtrl'
        }
      }
    })
    .state('tab.stack-detail', {
      url: '/stacks/:code',
      views: {
        'tab-stacks': {
          templateUrl: 'templates/stack-detail.html',
          controller: 'StackDetailCtrl'
        }
      }
    })
    
    
  .state('tab.warning', {
    url: '/warning',
    views: {
      'tab-warning': {
        templateUrl: 'templates/tab-warning.html',
        controller: 'WarningCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/stacks');

});
