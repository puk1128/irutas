angular.module('starter.controllers', ['ionic','ngCordova'])

.controller('SignInCtrl', function($scope, $state, $localStorage) {

  $scope.signIn = function(user) {
    console.log('Login equipo: ', user.equipo,' Clave: ',user.clave,' password: ',user.password);
		$localStorage.set('equipo',user.equipo);
		$localStorage.set('clave',user.clave);
    $state.go('tab.esri');
  };

})

.controller('MapaCtrl', function($scope, $cordovaGeolocation, $ionicLoading) {
	console.log("Entro MapaCtrl");
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });

        var posOptions = {
            enableHighAccuracy: true,
            timeout: 30000,
            //maximumAge: 10000,
        };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;

            var myLatlng = new google.maps.LatLng(lat, long);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            var myLocation = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: "Posición inicial",
								icon: 'img/car_blue.png'
            });

            $scope.map = map;
            $ionicLoading.hide();


        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });

				/*
				var watchOptions = {
					frequency : 100000,
					timeout : 3000,
					enableHighAccuracy: false // may cause errors if true
				};

				var watch = $cordovaGeolocation.watchPosition(watchOptions);
				watch.then(
					null,
					function(err) {

					},
					function(position) {
						var lat  = position.coords.latitude
						var long = position.coords.longitude
						var myLatlng = new google.maps.LatLng(lat, long);

						var myLocation = new google.maps.Marker({
                position: myLatlng,
                map: $scope.map,
                title: "Mi posición",
								icon: 'img/car_red.png'
            });

				});*/

    }
/*	google.maps.event.addDomListener(window, 'load', function() {
    var myLatlng = new google.maps.LatLng(19.3600, -99.16);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            //mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

				navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "Mi posición"
            });
						google.maps.event.addListener(myLocation, 'dragend', function(evt){
								console.log('Current Latitude:',evt.latLng.lat(),'Current Longitude:',evt.latLng.lng());
						});
        });

        $scope.map = map;
    });*/
})

.controller('EsriCtrl', function($scope, $ionicLoading, $localStorage, obtenerEnviarPosicion, tracking, $ionicPlatform, $cordovaVibration,$cordovaBackgroundGeolocation) {
	$ionicPlatform.ready(function(){

		var fecha = new Date();
		console.log("MapaCtrl: "+fecha);
		var urlMapa = './img/MapQuest/{z}/{x}/{y}.jpg';
		var toptions = {
			tms: false,
			maxZoom: 14,
			minZoom: 12,
		}
		//console.log("File system: "+urlMapa);
		//document.addEventListener("deviceready", onDeviceReady, false);
		//function onDeviceReady() {
		console.log("MapaCtrl: Inicializando Mapa y variables url: "+urlMapa);

		var lat = $localStorage.get('lastLatitud',19.4321557);
		var lng = $localStorage.get('lastLongitud',-99.1341969);
		var equipo = $localStorage.get('equipo',0);
		var clave = $localStorage.get('clave','00');

/*		if ($scope.map == null){
			var map = L.map('esrimap');
			L.esri.basemapLayer('Streets').addTo(map);
			map.setView([lat,lng],16);
			$scope.map = map;
		}*/
		if ($scope.map == null){
			var map = L.map('esrimap');
			L.tileLayer(urlMapa,toptions).addTo(map);
			map.setView([lat,lng],14);
			$scope.map = map;
		}

		if($scope.marker == null) {
			var iurl = 'img/car_gray.png';
			if(equipo == 1) {iurl = 'img/car_red.png';}
			else if(equipo == 2) {iurl = 'img/car_blue.png';}
			else if(equipo == 3) {iurl = 'img/car_yellow.png';}
			else if(equipo == 4) {iurl = 'img/car_green.png';}
			var icon = L.icon({iconUrl: iurl});
			var marker = L.marker([lat,lng],{icon: icon}).addTo($scope.map);
			$scope.marker = marker;
			$scope.map
		}
		$scope.equipo = equipo;
		$scope.clave = clave;

		$scope.mPosicion = function(position, data, status, statusText){
			lat = position.coords.latitude;
			lng = position.coords.longitude;

			var marker = $scope.marker;
			var map = $scope.map;
			marker.setLatLng([lat,lng]);
			map.setView(marker.getLatLng(),map.getZoom());

			$scope.lat = lat;
			$scope.lng = lng;
			$scope.precision = position.coords.accuracy;
			$scope.remoteid = data.id;
			$scope.status = status;
			$scope.statusText = statusText;

			console.log("EsriCtrl: Posición adquirida a mapa: ",lat,lng,position.coords.accuracy);
			$ionicLoading.hide();
		};

		obtenerEnviarPosicion(equipo,clave, $scope.mPosicion);
		//tracking.init();
});

	$scope.enviarPosicion = function(){
		$ionicLoading.show({
			template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Adquiriendo posición'
		});
		obtenerEnviarPosicion($scope.equipo, $scope.clave, $scope.mPosicion);
	}

	var boptions = {
		desiredAccuracy: 10,
		stationaryRadius: 20,
		distanceFilter: 30,
		locationTimeout: 3000,
		activityRecognitionInterval: 10,
		notificationText: 'La posición adquirida es: ',
		notificationTitle: 'Posición Adquirida',
		debug: false,
		stopOnTerminate: false,
		activityType: 'AutomotiveNavigation',

		url: 'http://puk.dyndns-server.com/rutas2/web/ruta/create2',
		method: 'POST',
		params:{equipo: $scope.equipo,clave: $scope.clave},
	};

	var callbackFn = function(location) {
		var coords = location.coords;
    console.log('[BackgroundGeoLocation] Posición Adquirida: ',coords.latitude,coords.longitude,coords.accuracy);
		$scope.lat = coords.latitude;
		$scope.lng = coords.longitude;
		$scope.precision = coords.accuracy;
  };
	var failureFn = function(error) {
    console.log('[BackgroundGeoLocation] Error: '+error);
  };
	//$cordovaBackgroundGeolocation.configure(callbackFn, failureFn, boptions);
	$cordovaBackgroundGeolocation.configure(boptions).then(null,failureFn,callbackFn);

	$scope.iniciar = function(){
		$cordovaBackgroundGeolocation.start();
		console.log('Envio de posición iniciado');

/*
		console.log('EsriCtrl: Iniciando Auto Envio');
		var equipo = $scope.equipo;
		tracking.begin(equipo, function(location, data, status, statusText){
			if(data == 0){
				console.log('EsriCtrl: No se pudo enviar la posición');
				$scope.remoteid = 'ERR';
				$scope.equipo = 0;
			} else {
				$scope.remoteid = data.id;
				$scope.equipo = data.equipo;
			}
			$scope.lat = location.latitude;
			$scope.lng = location.longitude;
			$scope.status = status;
			$scope.statusText = statusText;
			console.log('EsriCtrl: Actualizando datos');
			var marker = $scope.marker;
			var map = $scope.map;
			marker.setLatLng([location.latitude,location.longitude]);
			map.setView(marker.getLatLng(),map.getZoom());
			console.log("EsriCtrl: Watch Posición adquirida y enviada");
			//$cordovaVibration.vibrate(100);
		}); /* ** */
	}

	$scope.parar = function(){
		$cordovaBackgroundGeolocation.stop();
		console.log('Envio de Evento detenido');
		//tracking.end();
  // OR
  /* $cordovaGeolocation.clearWatch(watch)
    .then(function(result) {
      // success
      }, function (error) {
      // error
    }); */
	}

/*        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;

            var map = L.map('esrimap').setView([lat,long],16);

						L.esri.basemapLayer('Streets').addTo(map);

						var icon = L.icon({iconUrl:'img/car_red.png'});
            var myLocation = L.marker([lat, long],{icon: icon}).addTo(map);
						myLocation.bindPopup("Mi posición");

            $scope.esrimap = map;
            $ionicLoading.hide();



        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });
    //}*/
});

/*
.controller('DashCtrl', function($scope, $rootScope, $ionicUser, $ionicPush, $log) {
	$rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    alert("Successfully registered token " + data.token);
    $log.info('Ionic Push: Got token ', data.token, data.platform);
    $scope.token = data.token;
  });
	$scope.identifyUser = function(){
		$log.info('Ionic User: Identifying with Ionic User service');
		var user = $ionicUser.get();
    if(!user.user_id) {
      // Set your user_id here, or generate a random one.
      user.user_id = $ionicUser.generateGUID();
    };

    // Add some metadata to your user object.
    angular.extend(user, {
      name: 'Ionitron',
      bio: 'I come from planet Ion'
    });

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      $scope.identified = true;
      alert('Identified user ' + user.name + '\n ID ' + user.user_id);
    });
	};
	$scope.pushRegister = function() {
    $log.info('Ionic Push: Registering user');

    // Register with the Ionic Push service.  All parameters are optional.
    $ionicPush.register({
      canShowAlert: true, //Can pushes show an alert on your screen?
      canSetBadge: true, //Can pushes update app icon badges?
      canPlaySound: true, //Can notifications play a sound?
      canRunActionsOnWake: true, //Can run actions outside the app,
      onNotification: function(notification) {
        // Handle new push notifications here
        $log.info(notification);
        return true;
      }
    });
  };
	$scope.pushPusher = function(){
		var pusher = new Pusher('33c6290beb6f815e150c', {
      encrypted: true
    });
		var channel = pusher.subscribe('test_channel');
    channel.bind('my_event', function(data) {
      alert(data.message);
    });
	}
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
*/