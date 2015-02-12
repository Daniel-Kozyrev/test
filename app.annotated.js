(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/app/app.js":[function(require,module,exports){
/*globals angular*/

var app = angular.module('app', [
    'ngRoute',
    'ngResource',
    'bootstrapLightbox'
]);

app.config(["$routeProvider", function($routeProvider) {
    'use strict';
    $routeProvider.when('/search/:tag', {
        templateUrl: 'search.html'
    })
    .when('/owner/:id', {
        templateUrl: 'owner.html'

    })
    .otherwise({
        redirectTo: '/search/ '
    });
}]);

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
// app.controller('OwnerCtrl', require('./controllers/owner-ctrl'));

},{"./controllers/search-ctrl":"C:\\test\\angular-browserify-gulp-starter\\src\\app\\controllers\\search-ctrl.js","./services/flickr-service":"C:\\test\\angular-browserify-gulp-starter\\src\\app\\services\\flickr-service.js"}],"C:\\test\\angular-browserify-gulp-starter\\src\\app\\controllers\\search-ctrl.js":[function(require,module,exports){
/* @ngInject */
module.exports = function SearchCtrl($http, $route, FlickrService, $location, $scope, Lightbox) {
    'use strict';
    var vm = this;
    vm.displayText = 'Flickr Photos';
    vm.tags = $route.current.params.tag;
    vm.size = 'm';
    vm.sizeb = 'b';
    vm.id = $route.current.params.id;
    vm.images = [];
    vm.searchByTag = null;

    //Toggle function for table/grid view
    vm.toggle = function() {
        $scope.table = !$scope.table;
    };

    vm.search = function () {
        if ($scope.searchByTag) {
            console.log($scope.searchByTag);
            FlickrService.res('flickr.photos.search').search({ tags: vm.tags }, function (data) {
                vm.photos = data.photos.photo;
                vm.imagesArr(vm.photos);
            });
            // URL update
            $location.path('/search/'+ vm.tags);
        }
        else {
            FlickrService.res('flickr.people.getPublicPhotos').search({ user_id: vm.id }, function (data) {
                vm.photos = data.photos.photo;
                vm.imagesArr(vm.photos);
            });

            // URL update
            $location.path('/owner/'+ vm.tags);
        }
    };

    vm.init = function() {
        if(vm.tags) {
            FlickrService.res('flickr.photos.search').search({ tags: vm.tags }, function (data) {
                vm.photos = data.photos.photo;
                vm.imagesArr(vm.photos);
            });
        }
        if(vm.id) {
            FlickrService.res('flickr.people.getPublicPhotos').search({ user_id: vm.id }, function (data) {
                vm.photos = data.photos.photo;
                vm.imagesArr(vm.photos);
            });
        }
    };
    vm.init();

    //Creating images array for lightbox plugin
    vm.imagesArr = function(photos) {
        for(var photo in photos) {
            vm.images.push({'url':'https://farm'+photos[photo].farm+'.staticflickr.com/'+
                photos[photo].server+'/'+photos[photo].id+'_'+photos[photo].secret+'_'+
                vm.sizeb+'.jpg'});
        }
    };
    //Lightbox plugin initiation
    //
    vm.openLightboxModal = function (index) {
    Lightbox.openModal(vm.images, index);
  };


};
module.exports.$inject = ["$http", "$route", "FlickrService", "$location", "$scope", "Lightbox"];

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
module.exports.$inject = ["$resource", "FlickrApiKey"];

},{}]},{},["./src/app/app.js"]);
