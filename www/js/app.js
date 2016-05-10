// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform,$localStorage,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
		$rootScope.lenvios = $localStorage.getObject('lenvios');
		if($rootScope.lenvios.constructor !== Array) {
			console.log('lenvios no esta definida, por lo que se inicializa.')
			$rootScope.lenvios = [];
			$localStorage.setObject('lenvios',$rootScope.lenvios);
		} else {
			console.log('lenvios esta definida como array. longitud: '+$rootScope.lenvios.length);
			for(var i=0;i<$rootScope.lenvios.length;i++){
				console.log(i+':'+$rootScope.lenvios[i]);
			}
		}
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

	.state('signin', {
      url: "/sign-in",
      templateUrl: "templates/sign-in.html",
      controller: 'SignInCtrl'
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
/*
  .state('tab.mapa', {
    url: '/mapa',
    views: {
      'tab-mapa': {
        templateUrl: 'templates/tab-mapa.html',
        controller: 'MapaCtrl'
      }
    }
  })
*/
  .state('tab.esri', {
    url: '/esri',
    views: {
      'tab-esri': {
        templateUrl: 'templates/tab-esri.html',
        controller: 'EsriCtrl'
      }
    }
  })

/*
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
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
*/
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/sign-in');

});
