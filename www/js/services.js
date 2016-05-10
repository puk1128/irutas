angular.module('starter.services', ['ionic','ngCordova'])

.factory('deviceReady', function(){
	return function(done) {
    if (typeof window.cordova === 'object') {
      document.addEventListener('deviceready', function () {
        done();
      }, false);
    } else {
      done();
    }
  };
})

.factory('$localStorage',['$window', function($window){
		return {
			set: function(key, value){
				$window.localStorage[key] = value;
			},
			get: function(key, defaultValue) {
				return $window.localStorage[key] || defaultValue;
			},
			setObject: function(key, value) {
				$window.localStorage[key] = JSON.stringify(value);
			},
			getObject: function(key) {
				return JSON.parse($window.localStorage[key] || '{}');
			}
		}
}])

.factory('enviaPosicion',function($http,$localStorage,$rootScope){
	return function(eq,clave,position,done) {
		var data = {
			equipo: eq,
			clave: clave,
			lat: position.coords.latitude,
			lng: position.coords.longitude,
			altitude: position.coords.altitude,
			accuracy: position.coords.accuracy,
			altitudeaccuracy: position.coords.altitudeAccuracy,
			heading: position.coords.heading,
			speed: position.coords.speed,
			celtime: position.coords.timestamp
		};
		$http.post('http://puk.dyndns-server.com/rutas2/web/ruta',
		data,{
			//Authorization: "OAuth2: token"
		}).then(function(response){
			console.log('Webservice Success: '+response.data.id+', '+response.status+', '+response.statusText);
			done(response.data,response.status,response.statusText);
		}, function(response){
			console.log('Webservice Error: '+0+', '+response.status+', '+response.statusText);
			$rootScope.lenvios.push(data);
			$localStorage.setObject('lenvios',$rootScope.lenvios);
			done(0,response.status,response.statusText);
		});
	}
})

.factory('obtenerPosicion',function($ionicPlatform,$cordovaGeolocation, $document, $window, $rootScope){
	return function(done){
		$ionicPlatform.ready(function(){
			var posOptions = {
            enableHighAccuracy: true,
            timeout: 3000,
            //maximumAge: 10000,
      };
			$cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            done(position);
			});
		});
	}
})

.factory('obtenerEnviarPosicion', function(obtenerPosicion,enviaPosicion,$localStorage){
	return function(equipo, clave, done) {
		obtenerPosicion(function(position){
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			$localStorage.set('lastLatitud',lat);
			$localStorage.set('lastLongitud',lng);
			$localStorage.set('lastAltitude',position.coords.altitude);
			$localStorage.set('lastAccuracy',position.coords.accuracy);
			$localStorage.set('lastAltitudeAccuracy',position.coords.altitudeAccuracy);
			$localStorage.set('lastHeading',position.coords.heading);
			$localStorage.set('lastSpeed',position.coords.speed);
			$localStorage.set('lastTimestamp',position.coords.timestamp);

			console.log("Posición adquirida: "+lat+", "+lng);
			enviaPosicion(equipo,clave,position,function(data, status, statusText){
				console.log("Posición Enviada: "+lat+', '+lng+' Equipo: '+equipo+' Clave: '+clave);
				done(position, data, status, statusText);
			});
		});
	}
})

.factory('oldtracking',function(obtenerEnviarPosicion, $localStorage, $cordovaBackgroundGeolocation){
	console.log('Inicializando el servico de tracking');
	var lat,lng;
	var lblLat,lblLng;
	var processing = false;
	var minDistance = 10;
	var duration = 300000;
	var interval;
	var equipo;// = $localStorage.get('equipo',0);
	var callback;


	function getKm(lat1,lng1,lat2,lng2){
		var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lng2-lng1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
	}

	function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

	function getCurrentPosition(){
		console.log('Current Position Running');
		if(processing) return;
		processing = true;
		obtenerEnviarPosicion(equipo, function(position, data, status, statusTex){
			//processing = false;
			lblLat = position.coords.latitude;
			lblLng = position.coords.longitude;
			console.log('Hecho: ['+lblLat+', '+lblLng+']');
			callback(position,data, status, statusTex);
			processing = false;
			//var dist = getDistanceFromLatLonInKm(lat, long, position.coords.latitude, position.coords.longitude);
			//console.log("dist in km is "+dist);
			//if(dist <= minDistance) callback();
		});
	}
	return {
		begin:function(eq,done) {
			 equipo = eq;
       callback = done;
       interval = window.setInterval(getCurrentPosition, duration);
       getCurrentPosition();
     },
     end: function() {
       window.clearInterval(interval);
     },
     setTarget: function(lg,lt) {
       lng = lg;
       lat = lt;
     }
	}

})

.factory('tracking',function($localStorage, $cordovaBackgroundGeolocation,$cordovaVibration){
	console.log('Inicializando el servico de tracking');
	var lat,lng;
	var lblLat,lblLng;
	var processing = false;
	var minDistance = 10;
	var duration = 300000;
	var interval;
	var equipo = 0;// = $localStorage.get('equipo',0);
	var callback;

	var options = {
		desiredAccuracy: 10,
		stationaryRadius: 20,
		distanceFilter: 30,
		locationTimeout: 3000,
		activityRecognitionInterval: 10,
		notificationText: 'La posición adquirida es: ',
		notificationTitle: 'Posición Adquirida',
		debug: true,
		stopOnTerminate: false,
		activityType: 'AutomotiveNavigation',

		//url: 'http://puk.dyndns-server.com/rutas2/web/ruta',
	}

	var yourAjaxCallback = function(response) {
        ////
        // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
        //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        //
        //
        $cordovaBackgroundGeolocation.finish();
    };

	var callbackFn = function(location){
		lat = location.latitude;
		lng = location.longitude;
		console.log('[js] BackgroundGeoLocation callback:  ' + lat + ',' + lng + ' speed: '+location.speed+' bearing: '+location.bearing+' altitude: '+location.altitude+' recorded_at: '+location.recorded_at);
		enviaPosicion(equipo,lat,lng,function(data, status, statusText){
			console.log("Posición Enviada: "+lat+', '+lng+' Equipo: '+equipo);
			callback(location, data, status, statusText);
		});
		$cordovaVibration.vibrate(100);
	}

	var failureFn = function(error) {
    console.log('BackgroundGeoLocation error');
  }



	return {
		init: function(){
			$cordovaBackgroundGeolocation.configure(options)
			.then(null,failureFn,callbackFn);
		},
		begin:function(eq,done) {
			 equipo = eq;
       callback = done;
			 $cordovaBackgroundGeolocation.start();
     },
     end: function() {
       $cordovaBackgroundGeolocation.stop();
     },
     setTarget: function(lg,lt) {
       lng = lg;
       lat = lt;
     }
	}

});
