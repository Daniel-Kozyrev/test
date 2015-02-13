(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/app/app.js":[function(require,module,exports){
/*globals angular*/

var app = angular.module('app', [
    'ngRoute',
    'ngResource',
    'bootstrapLightbox'
]);

app.config(function($routeProvider) {
    'use strict';
    $routeProvider.when('/search/:tag', {
        templateUrl: 'search.html'
    })
    .when('/owner/:id', {
        templateUrl: 'search.html'

    })
    .otherwise({
        redirectTo: '/search/forest'
    });
});

app.constant('FlickrApiKey', function() {
    'use strict';
    return 'cb9d94cde1c29815cd5a842c26496123';
});

//NOTE Be sure to precede every function exported and added to this module with /* @ngInject */
//This is an explicit hint to ng-annotate, and is required,
//because comprehending and traversing the browserify-ed commonJS modules is beyond the scope of ng-annotate
//If this is not done, AngularJs' dependency injection will fail on minified builds
//See https://docs.angularjs.org/tutorial/step_05#a-note-on-minification
app.factory('FlickrService', require('./services/flickr-service'));
app.controller('SearchCtrl', require('./controllers/search-ctrl'));


},{"./controllers/search-ctrl":"C:\\test\\angular-browserify-gulp-starter\\src\\app\\controllers\\search-ctrl.js","./services/flickr-service":"C:\\test\\angular-browserify-gulp-starter\\src\\app\\services\\flickr-service.js"}],"C:\\test\\angular-browserify-gulp-starter\\src\\app\\controllers\\search-ctrl.js":[function(require,module,exports){
/* @ngInject */
module.exports = function SearchCtrl($http, $route, FlickrService, $location, $scope, Lightbox, $filter) {
    'use strict';
    var vm = this;

    vm.displayText = 'Flickr Photos';
    vm.tags = $route.current.params.tag;
    vm.size = 'm';
    vm.sizeb = 'b';
    vm.id = $route.current.params.id;
    vm.images = [];
    vm.searchByTag = null;
    vm.order = null;
    vm.asc = 'true';

    //  Toggle function for table/grid view
    vm.toggle = function() {
        $scope.table = !$scope.table;
    };

    // Creating images array for the Lightbox plugin
    vm.imagesArr = function(photos) {
        angular.forEach(photos, function(obj) {
            obj.url='https://farm'+obj.farm+'.staticflickr.com/'+
                obj.server+'/'+obj.id+'_'+obj.secret+'_'+
                vm.sizeb+'.jpg';
        });
    };

    // Filter Function for the array that solves Lightbox problem on orderBy
    vm.filterFunc = function(orderBy,asc) {
        vm.photos=$filter('orderBy')(vm.photos,orderBy,asc);
        vm.asc = !vm.asc;
        vm.order = orderBy;
    };

    //  Lightbox plugin initiation
    //
    vm.openLightboxModal = function (index) {
    Lightbox.openModal(vm.photos, index);
  };
    // Views changes Search function
    vm.search = function () {
        $location.path($scope.searchByTag ? '/search/'+ vm.tags : '/owner/'+ vm.tags);
    };

    // Search function after view change
    vm.init = function() {
        FlickrService.res(vm.tags ? 'flickr.photos.search' : 'flickr.people.getPublicPhotos')
        .search(vm.tags ? { tags: vm.tags } : { user_id: vm.id }, function (data) {
            vm.photos = data.photos.photo;
            vm.imagesArr(vm.photos);
        });
    };
    vm.init();


};

},{}],"C:\\test\\angular-browserify-gulp-starter\\src\\app\\services\\flickr-service.js":[function(require,module,exports){
/* @ngInject */
module.exports = function FlickService($resource, FlickrApiKey) {
    'use strict';

    return {
        res: function (method) {
            console.log(method);
            return $resource('https://api.flickr.com/services/rest/',
                {
                    format: 'json',
                    api_key: FlickrApiKey,
                    nojsoncallback: 1
                },
                {
                    'search': {
                        method: 'GET',
                        params: {
                            method: method
                        },
                        interceptor: {
                            'response': function (response) {
                                // look at 'stat'
                                switch (response.data.stat) {
                                    case 'fail':
                                        console.error('FlickService error: %s', response.data.message);
                                        return { photos: { photo: {} } };
                                    case 'ok':
                                        console.log(response.data);
                                        return response.data;

                                }

                            }
                        }
                    }
                }
            );
        }
    };

};

},{}]},{},["./src/app/app.js"]);
