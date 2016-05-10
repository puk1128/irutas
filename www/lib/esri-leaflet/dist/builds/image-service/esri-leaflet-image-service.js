/*! esri-leaflet - v1.0.0 - 2015-07-10
*   Copyright (c) 2015 Environmental Systems Research Institute, Inc.
*   Apache License*/
(function (factory) {
  //define an AMD module that relies on 'leaflet'
  if (typeof define === 'function' && define.amd) {
    define(['leaflet'], function (L) {
      return factory(L);
    });
  //define a common js module that relies on 'leaflet'
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('leaflet'));
  }

  if(typeof window !== 'undefined' && window.L){
    factory(window.L);
  }
}(function (L) {

var EsriLeaflet={VERSION:"1.0.0",Layers:{},Services:{},Controls:{},Tasks:{},Util:{},Support:{CORS:!!(window.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest),pointerEvents:""===document.documentElement.style.pointerEvents}};"undefined"!=typeof window&&window.L&&(window.L.esri=EsriLeaflet),function(a){function b(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b}function c(a,b){for(var c=0;c<a.length;c++)if(a[c]!==b[c])return!1;return!0}function d(a){return c(a[0],a[a.length-1])||a.push(a[0]),a}function e(a){var b,c=0,d=0,e=a.length,f=a[d];for(d;e-1>d;d++)b=a[d+1],c+=(b[0]-f[0])*(b[1]+f[1]),f=b;return c>=0}function f(a,b,c,d){var e=(d[0]-c[0])*(a[1]-c[1])-(d[1]-c[1])*(a[0]-c[0]),f=(b[0]-a[0])*(a[1]-c[1])-(b[1]-a[1])*(a[0]-c[0]),g=(d[1]-c[1])*(b[0]-a[0])-(d[0]-c[0])*(b[1]-a[1]);if(0!==g){var h=e/g,i=f/g;if(h>=0&&1>=h&&i>=0&&1>=i)return!0}return!1}function g(a,b){for(var c=0;c<a.length-1;c++)for(var d=0;d<b.length-1;d++)if(f(a[c],a[c+1],b[d],b[d+1]))return!0;return!1}function h(a,b){for(var c=!1,d=-1,e=a.length,f=e-1;++d<e;f=d)(a[d][1]<=b[1]&&b[1]<a[f][1]||a[f][1]<=b[1]&&b[1]<a[d][1])&&b[0]<(a[f][0]-a[d][0])*(b[1]-a[d][1])/(a[f][1]-a[d][1])+a[d][0]&&(c=!c);return c}function i(a,b){var c=g(a,b),d=h(a,b[0]);return!c&&d?!0:!1}function j(a){for(var b,c,f,h=[],j=[],k=0;k<a.length;k++){var l=d(a[k].slice(0));if(!(l.length<4))if(e(l)){var m=[l];h.push(m)}else j.push(l)}for(var n=[];j.length;){f=j.pop();var o=!1;for(b=h.length-1;b>=0;b--)if(c=h[b][0],i(c,f)){h[b].push(f),o=!0;break}o||n.push(f)}for(;n.length;){f=n.pop();var p=!1;for(b=h.length-1;b>=0;b--)if(c=h[b][0],g(c,f)){h[b].push(f),p=!0;break}p||h.push([f.reverse()])}return 1===h.length?{type:"Polygon",coordinates:h[0]}:{type:"MultiPolygon",coordinates:h}}function k(a){var b=[],c=a.slice(0),f=d(c.shift().slice(0));if(f.length>=4){e(f)||f.reverse(),b.push(f);for(var g=0;g<c.length;g++){var h=d(c[g].slice(0));h.length>=4&&(e(h)&&h.reverse(),b.push(h))}}return b}function l(a){for(var b=[],c=0;c<a.length;c++)for(var d=k(a[c]),e=d.length-1;e>=0;e--){var f=d[e].slice(0);b.push(f)}return b}var m=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(a){return window.setTimeout(a,1e3/60)};a.Util.extentToBounds=function(a){var b=new L.LatLng(a.ymin,a.xmin),c=new L.LatLng(a.ymax,a.xmax);return new L.LatLngBounds(b,c)},a.Util.boundsToExtent=function(a){return a=L.latLngBounds(a),{xmin:a.getSouthWest().lng,ymin:a.getSouthWest().lat,xmax:a.getNorthEast().lng,ymax:a.getNorthEast().lat,spatialReference:{wkid:4326}}},a.Util.arcgisToGeojson=function(c,d){var e={};return"number"==typeof c.x&&"number"==typeof c.y&&(e.type="Point",e.coordinates=[c.x,c.y]),c.points&&(e.type="MultiPoint",e.coordinates=c.points.slice(0)),c.paths&&(1===c.paths.length?(e.type="LineString",e.coordinates=c.paths[0].slice(0)):(e.type="MultiLineString",e.coordinates=c.paths.slice(0))),c.rings&&(e=j(c.rings.slice(0))),(c.geometry||c.attributes)&&(e.type="Feature",e.geometry=c.geometry?a.Util.arcgisToGeojson(c.geometry):null,e.properties=c.attributes?b(c.attributes):null,c.attributes&&(e.id=c.attributes[d]||c.attributes.OBJECTID||c.attributes.FID)),e},a.Util.geojsonToArcGIS=function(c,d){d=d||"OBJECTID";var e,f={wkid:4326},g={};switch(c.type){case"Point":g.x=c.coordinates[0],g.y=c.coordinates[1],g.spatialReference=f;break;case"MultiPoint":g.points=c.coordinates.slice(0),g.spatialReference=f;break;case"LineString":g.paths=[c.coordinates.slice(0)],g.spatialReference=f;break;case"MultiLineString":g.paths=c.coordinates.slice(0),g.spatialReference=f;break;case"Polygon":g.rings=k(c.coordinates.slice(0)),g.spatialReference=f;break;case"MultiPolygon":g.rings=l(c.coordinates.slice(0)),g.spatialReference=f;break;case"Feature":c.geometry&&(g.geometry=a.Util.geojsonToArcGIS(c.geometry,d)),g.attributes=c.properties?b(c.properties):{},c.id&&(g.attributes[d]=c.id);break;case"FeatureCollection":for(g=[],e=0;e<c.features.length;e++)g.push(a.Util.geojsonToArcGIS(c.features[e],d));break;case"GeometryCollection":for(g=[],e=0;e<c.geometries.length;e++)g.push(a.Util.geojsonToArcGIS(c.geometries[e],d))}return g},a.Util.responseToFeatureCollection=function(b,c){var d;if(c)d=c;else if(b.objectIdFieldName)d=b.objectIdFieldName;else if(b.fields){for(var e=0;e<=b.fields.length-1;e++)if("esriFieldTypeOID"===b.fields[e].type){d=b.fields[e].name;break}}else d="OBJECTID";var f={type:"FeatureCollection",features:[]},g=b.features||b.results;if(g.length)for(var h=g.length-1;h>=0;h--)f.features.push(a.Util.arcgisToGeojson(g[h],d));return f},a.Util.cleanUrl=function(a){return a=a.replace(/^\s+|\s+$|\A\s+|\s+\z/g,""),"/"!==a[a.length-1]&&(a+="/"),a},a.Util.isArcgisOnline=function(a){return/\.arcgis\.com.*?FeatureServer/g.test(a)},a.Util.geojsonTypeToArcGIS=function(a){var b;switch(a){case"Point":b="esriGeometryPoint";break;case"MultiPoint":b="esriGeometryMultipoint";break;case"LineString":b="esriGeometryPolyline";break;case"MultiLineString":b="esriGeometryPolyline";break;case"Polygon":b="esriGeometryPolygon";break;case"MultiPolygon":b="esriGeometryPolygon"}return b},a.Util.requestAnimationFrame=L.Util.bind(m,window),a.Util.warn=function(a){console&&console.warn&&console.warn(a)}}(EsriLeaflet),function(a){function b(a){var b="";a.f=a.f||"json";for(var c in a)if(a.hasOwnProperty(c)){var d,e=a[c],f=Object.prototype.toString.call(e);b.length&&(b+="&"),d="[object Array]"===f?"[object Object]"===Object.prototype.toString.call(e[0])?JSON.stringify(e):e.join(","):"[object Object]"===f?JSON.stringify(e):"[object Date]"===f?e.valueOf():e,b+=encodeURIComponent(c)+"="+encodeURIComponent(d)}return b}function c(a,b){var c=new XMLHttpRequest;return c.onerror=function(d){c.onreadystatechange=L.Util.falseFn,a.call(b,{error:{code:500,message:"XMLHttpRequest error"}},null)},c.onreadystatechange=function(){var d,e;if(4===c.readyState){try{d=JSON.parse(c.responseText)}catch(f){d=null,e={code:500,message:"Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error."}}!e&&d.error&&(e=d.error,d=null),c.onerror=L.Util.falseFn,a.call(b,e,d)}},c}var d=0;window._EsriLeafletCallbacks={},a.Request={request:function(d,e,f,g){var h=b(e),i=c(f,g),j=(d+"?"+h).length;if(2e3>=j&&L.esri.Support.CORS)i.open("GET",d+"?"+h),i.send(null);else{if(!(j>2e3&&L.esri.Support.CORS))return 2e3>=j&&!L.esri.Support.CORS?L.esri.Request.get.JSONP(d,e,f,g):void a.Util.warn("a request to "+d+" was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy http://esri.github.io/esri-leaflet/api-reference/request.html");i.open("POST",d),i.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),i.send(h)}return i},post:{XMLHTTP:function(a,d,e,f){var g=c(e,f);return g.open("POST",a),g.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),g.send(b(d)),g}},get:{CORS:function(a,d,e,f){var g=c(e,f);return g.open("GET",a+"?"+b(d),!0),g.send(null),g},JSONP:function(a,c,e,f){var g="c"+d;c.callback="window._EsriLeafletCallbacks."+g;var h=L.DomUtil.create("script",null,document.body);return h.type="text/javascript",h.src=a+"?"+b(c),h.id=g,window._EsriLeafletCallbacks[g]=function(a){if(window._EsriLeafletCallbacks[g]!==!0){var b,c=Object.prototype.toString.call(a);"[object Object]"!==c&&"[object Array]"!==c&&(b={error:{code:500,message:"Expected array or object as JSONP response"}},a=null),!b&&a.error&&(b=a,a=null),e.call(f,b,a),window._EsriLeafletCallbacks[g]=!0}},d++,{id:g,url:h.src,abort:function(){window._EsriLeafletCallbacks._callback[g]({code:0,message:"Request aborted."})}}}}},a.get=a.Support.CORS?a.Request.get.CORS:a.Request.get.JSONP,a.post=a.Request.post.XMLHTTP,a.request=a.Request.request}(EsriLeaflet),EsriLeaflet.Services.Service=L.Class.extend({includes:L.Mixin.Events,options:{proxy:!1,useCors:EsriLeaflet.Support.CORS},initialize:function(a){a=a||{},this._requestQueue=[],this._authenticating=!1,L.Util.setOptions(this,a),this.options.url=EsriLeaflet.Util.cleanUrl(this.options.url)},get:function(a,b,c,d){return this._request("get",a,b,c,d)},post:function(a,b,c,d){return this._request("post",a,b,c,d)},request:function(a,b,c,d){return this._request("request",a,b,c,d)},metadata:function(a,b){return this._request("get","",{},a,b)},authenticate:function(a){return this._authenticating=!1,this.options.token=a,this._runQueue(),this},_request:function(a,b,c,d,e){this.fire("requeststart",{url:this.options.url+b,params:c,method:a});var f=this._createServiceCallback(a,b,c,d,e);if(this.options.token&&(c.token=this.options.token),this._authenticating)return void this._requestQueue.push([a,b,c,d,e]);var g=this.options.proxy?this.options.proxy+"?"+this.options.url+b:this.options.url+b;return"get"!==a&&"request"!==a||this.options.useCors?EsriLeaflet[a](g,c,f):EsriLeaflet.Request.get.JSONP(g,c,f)},_createServiceCallback:function(a,b,c,d,e){return L.Util.bind(function(f,g){!f||499!==f.code&&498!==f.code||(this._authenticating=!0,this._requestQueue.push([a,b,c,d,e]),this.fire("authenticationrequired",{authenticate:L.Util.bind(this.authenticate,this)}),f.authenticate=L.Util.bind(this.authenticate,this)),d.call(e,f,g),f?this.fire("requesterror",{url:this.options.url+b,params:c,message:f.message,code:f.code,method:a}):this.fire("requestsuccess",{url:this.options.url+b,params:c,response:g,method:a}),this.fire("requestend",{url:this.options.url+b,params:c,method:a})},this)},_runQueue:function(){for(var a=this._requestQueue.length-1;a>=0;a--){var b=this._requestQueue[a],c=b.shift();this[c].apply(this,b)}this._requestQueue=[]}}),EsriLeaflet.Services.service=function(a){return new EsriLeaflet.Services.Service(a)},EsriLeaflet.Services.ImageService=EsriLeaflet.Services.Service.extend({query:function(){return new EsriLeaflet.Tasks.Query(this)},identify:function(){return new EsriLeaflet.Tasks.IdentifyImage(this)}}),EsriLeaflet.Services.imageService=function(a){return new EsriLeaflet.Services.ImageService(a)},EsriLeaflet.Tasks.Task=L.Class.extend({options:{proxy:!1,useCors:EsriLeaflet.Support.CORS},generateSetter:function(a,b){return L.Util.bind(function(b){return this.params[a]=b,this},b)},initialize:function(a){if(a.request&&a.options?(this._service=a,L.Util.setOptions(this,a.options)):(L.Util.setOptions(this,a),this.options.url=L.esri.Util.cleanUrl(a.url)),this.params=L.Util.extend({},this.params||{}),this.setters)for(var b in this.setters){var c=this.setters[b];this[b]=this.generateSetter(c,this)}},token:function(a){return this._service?this._service.authenticate(a):this.params.token=a,this},request:function(a,b){return this._service?this._service.request(this.path,this.params,a,b):this._request("request",this.path,this.params,a,b)},_request:function(a,b,c,d,e){var f=this.options.proxy?this.options.proxy+"?"+this.options.url+b:this.options.url+b;return"get"!==a&&"request"!==a||this.options.useCors?EsriLeaflet[a](f,c,d,e):EsriLeaflet.Request.get.JSONP(f,c,d,e)}}),EsriLeaflet.Tasks.Query=EsriLeaflet.Tasks.Task.extend({setters:{offset:"offset",limit:"limit",fields:"outFields",precision:"geometryPrecision",featureIds:"objectIds",returnGeometry:"returnGeometry",token:"token"},path:"query",params:{returnGeometry:!0,where:"1=1",outSr:4326,outFields:"*"},within:function(a){return this._setGeometry(a),this.params.spatialRel="esriSpatialRelContains",this},intersects:function(a){return this._setGeometry(a),this.params.spatialRel="esriSpatialRelIntersects",this},contains:function(a){return this._setGeometry(a),this.params.spatialRel="esriSpatialRelWithin",this},overlaps:function(a){return this._setGeometry(a),this.params.spatialRel="esriSpatialRelOverlaps",this},nearby:function(a,b){return a=L.latLng(a),this.params.geometry=[a.lng,a.lat],this.params.geometryType="esriGeometryPoint",this.params.spatialRel="esriSpatialRelIntersects",this.params.units="esriSRUnit_Meter",this.params.distance=b,this.params.inSr=4326,this},where:function(a){return this.params.where=a,this},between:function(a,b){return this.params.time=[a.valueOf(),b.valueOf()],this},simplify:function(a,b){var c=Math.abs(a.getBounds().getWest()-a.getBounds().getEast());return this.params.maxAllowableOffset=c/a.getSize().y*b,this},orderBy:function(a,b){return b=b||"ASC",this.params.orderByFields=this.params.orderByFields?this.params.orderByFields+",":"",this.params.orderByFields+=[a,b].join(" "),this},run:function(a,b){return this._cleanParams(),EsriLeaflet.Util.isArcgisOnline(this.options.url)?(this.params.f="geojson",this.request(function(c,d){this._trapSQLerrors(c),a.call(b,c,d,d)},this)):this.request(function(c,d){this._trapSQLerrors(c),a.call(b,c,d&&EsriLeaflet.Util.responseToFeatureCollection(d),d)},this)},count:function(a,b){return this._cleanParams(),this.params.returnCountOnly=!0,this.request(function(b,c){a.call(this,b,c&&c.count,c)},b)},ids:function(a,b){return this._cleanParams(),this.params.returnIdsOnly=!0,this.request(function(b,c){a.call(this,b,c&&c.objectIds,c)},b)},bounds:function(a,b){return this._cleanParams(),this.params.returnExtentOnly=!0,this.request(function(c,d){a.call(b,c,d&&d.extent&&EsriLeaflet.Util.extentToBounds(d.extent),d)},b)},pixelSize:function(a){return a=L.point(a),this.params.pixelSize=[a.x,a.y],this},layer:function(a){return this.path=a+"/query",this},_trapSQLerrors:function(a){a&&"400"===a.code&&EsriLeaflet.Util.warn("one common syntax error in query requests is encasing string values in double quotes instead of single quotes")},_cleanParams:function(){delete this.params.returnIdsOnly,delete this.params.returnExtentOnly,delete this.params.returnCountOnly},_setGeometry:function(a){return this.params.inSr=4326,a instanceof L.LatLngBounds?(this.params.geometry=EsriLeaflet.Util.boundsToExtent(a),void(this.params.geometryType="esriGeometryEnvelope")):(a.getLatLng&&(a=a.getLatLng()),a instanceof L.LatLng&&(a={type:"Point",coordinates:[a.lng,a.lat]}),a instanceof L.GeoJSON&&(a=a.getLayers()[0].feature.geometry,this.params.geometry=EsriLeaflet.Util.geojsonToArcGIS(a),this.params.geometryType=EsriLeaflet.Util.geojsonTypeToArcGIS(a.type)),a.toGeoJSON&&(a=a.toGeoJSON()),"Feature"===a.type&&(a=a.geometry),"Point"===a.type||"LineString"===a.type||"Polygon"===a.type?(this.params.geometry=EsriLeaflet.Util.geojsonToArcGIS(a),void(this.params.geometryType=EsriLeaflet.Util.geojsonTypeToArcGIS(a.type))):void EsriLeaflet.Util.warn("invalid geometry passed to spatial query. Should be an L.LatLng, L.LatLngBounds or L.Marker or a GeoJSON Point Line or Polygon object"))}}),EsriLeaflet.Tasks.query=function(a){return new EsriLeaflet.Tasks.Query(a)},EsriLeaflet.Tasks.Identify=EsriLeaflet.Tasks.Task.extend({path:"identify",between:function(a,b){return this.params.time=[a.valueOf(),b.valueOf()],this}}),EsriLeaflet.Layers.RasterLayer=L.Class.extend({includes:L.Mixin.Events,options:{opacity:1,position:"front",f:"image"},onAdd:function(a){if(this._map=a,this._update=L.Util.limitExecByInterval(this._update,this.options.updateInterval,this),a.options.crs&&a.options.crs.code){var b=a.options.crs.code.split(":")[1];this.options.bboxSR=b,this.options.imageSR=b}a.on("moveend",this._update,this),this._currentImage&&this._currentImage._bounds.equals(this._map.getBounds())?a.addLayer(this._currentImage):this._currentImage&&(this._map.removeLayer(this._currentImage),this._currentImage=null),this._update(),this._popup&&(this._map.on("click",this._getPopupData,this),this._map.on("dblclick",this._resetPopupState,this))},bindPopup:function(a,b){return this._shouldRenderPopup=!1,this._lastClick=!1,this._popup=L.popup(b),this._popupFunction=a,this._map&&(this._map.on("click",this._getPopupData,this),this._map.on("dblclick",this._resetPopupState,this)),this},unbindPopup:function(){return this._map&&(this._map.closePopup(this._popup),this._map.off("click",this._getPopupData,this),this._map.off("dblclick",this._resetPopupState,this)),this._popup=!1,this},onRemove:function(a){this._currentImage&&this._map.removeLayer(this._currentImage),this._popup&&(this._map.off("click",this._getPopupData,this),this._map.off("dblclick",this._resetPopupState,this)),this._map.off("moveend",this._update,this),this._map=null},addTo:function(a){return a.addLayer(this),this},removeFrom:function(a){return a.removeLayer(this),this},bringToFront:function(){return this.options.position="front",this._currentImage&&this._currentImage.bringToFront(),this},bringToBack:function(){return this.options.position="back",this._currentImage&&this._currentImage.bringToBack(),this},getAttribution:function(){return this.options.attribution},getOpacity:function(){return this.options.opacity},setOpacity:function(a){return this.options.opacity=a,this._currentImage.setOpacity(a),this},getTimeRange:function(){return[this.options.from,this.options.to]},setTimeRange:function(a,b){return this.options.from=a,this.options.to=b,this._update(),this},metadata:function(a,b){return this._service.metadata(a,b),this},authenticate:function(a){return this._service.authenticate(a),this},_renderImage:function(a,b){if(this._map){var c=new L.ImageOverlay(a,b,{opacity:0}).addTo(this._map);c.once("load",function(a){var c=a.target,d=this._currentImage;c._bounds.equals(b)&&c._bounds.equals(this._map.getBounds())?(this._currentImage=c,"front"===this.options.position?this.bringToFront():this.bringToBack(),this._map&&this._currentImage._map?this._currentImage.setOpacity(this.options.opacity):this._currentImage._map.removeLayer(this._currentImage),d&&this._map&&this._map.removeLayer(d),d&&d._map&&d._map.removeLayer(d)):this._map.removeLayer(c),this.fire("load",{bounds:b})},this),this.fire("loading",{bounds:b})}},_update:function(){if(this._map){var a=this._map.getZoom(),b=this._map.getBounds();if(!this._animatingZoom&&!(this._map._panTransition&&this._map._panTransition._inProgress||a>this.options.maxZoom||a<this.options.minZoom)){var c=this._buildExportParams();this._requestExport(c,b)}}},_renderPopup:function(a,b,c,d){if(a=L.latLng(a),this._shouldRenderPopup&&this._lastClick.equals(a)){var e=this._popupFunction(b,c,d);e&&this._popup.setLatLng(a).setContent(e).openOn(this._map)}},_resetPopupState:function(a){this._shouldRenderPopup=!1,this._lastClick=a.latlng},_propagateEvent:function(a){a=L.extend({layer:a.target,target:this},a),this.fire(a.type,a)}}),EsriLeaflet.Layers.ImageMapLayer=EsriLeaflet.Layers.RasterLayer.extend({options:{updateInterval:150,format:"jpgpng",transparent:!0,f:"json"},query:function(){return this._service.query()},identify:function(){return this._service.identify()},initialize:function(a){a.url=EsriLeaflet.Util.cleanUrl(a.url),this._service=new EsriLeaflet.Services.ImageService(a),this._service.on("authenticationrequired requeststart requestend requesterror requestsuccess",this._propagateEvent,this),L.Util.setOptions(this,a)},setPixelType:function(a){return this.options.pixelType=a,this._update(),this},getPixelType:function(){return this.options.pixelType},setBandIds:function(a){return L.Util.isArray(a)?this.options.bandIds=a.join(","):this.options.bandIds=a.toString(),this._update(),this},getBandIds:function(){return this.options.bandIds},setNoData:function(a,b){return L.Util.isArray(a)?this.options.noData=a.join(","):this.options.noData=a.toString(),b&&(this.options.noDataInterpretation=b),this._update(),this},getNoData:function(){return this.options.noData},getNoDataInterpretation:function(){return this.options.noDataInterpretation},setRenderingRule:function(a){this.options.renderingRule=a,this._update()},getRenderingRule:function(){return this.options.renderingRule},setMosaicRule:function(a){this.options.mosaicRule=a,this._update()},getMosaicRule:function(){return this.options.mosaicRule},_getPopupData:function(a){var b=L.Util.bind(function(b,c,d){b||setTimeout(L.Util.bind(function(){this._renderPopup(a.latlng,b,c,d)},this),300)},this),c=this.identify().at(a.latlng);this.options.mosaicRule&&c.setMosaicRule(this.options.mosaicRule),c.run(b),this._shouldRenderPopup=!0,this._lastClick=a.latlng},_buildExportParams:function(){var a=this._map.getBounds(),b=this._map.getSize(),c=this._map.options.crs.project(a._northEast),d=this._map.options.crs.project(a._southWest),e={bbox:[d.x,d.y,c.x,c.y].join(","),size:b.x+","+b.y,format:this.options.format,transparent:this.options.transparent,bboxSR:this.options.bboxSR,imageSR:this.options.imageSR};return this.options.from&&this.options.to&&(e.time=this.options.from.valueOf()+","+this.options.to.valueOf()),this.options.pixelType&&(e.pixelType=this.options.pixelType),this.options.interpolation&&(e.interpolation=this.options.interpolation),this.options.compressionQuality&&(e.compressionQuality=this.options.compressionQuality),this.options.bandIds&&(e.bandIds=this.options.bandIds),this.options.noData&&(e.noData=this.options.noData),this.options.noDataInterpretation&&(e.noDataInterpretation=this.options.noDataInterpretation),this._service.options.token&&(e.token=this._service.options.token),this.options.renderingRule&&(e.renderingRule=JSON.stringify(this.options.renderingRule)),this.options.mosaicRule&&(e.mosaicRule=JSON.stringify(this.options.mosaicRule)),e},_requestExport:function(a,b){"json"===this.options.f?this._service.request("exportImage",a,function(a,c){a||this._renderImage(c.href,b)},this):(a.f="image",this._renderImage(this.options.url+"exportImage"+L.Util.getParamString(a),b))}}),EsriLeaflet.ImageMapLayer=EsriLeaflet.Layers.ImageMapLayer,EsriLeaflet.Layers.imageMapLayer=function(a){return new EsriLeaflet.Layers.ImageMapLayer(a)},EsriLeaflet.imageMapLayer=function(a){return new EsriLeaflet.Layers.ImageMapLayer(a)};
//# sourceMappingURL=esri-leaflet-image-service.js.map

  return EsriLeaflet;
}));