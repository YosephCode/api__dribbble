/**
* Services Module with api Dribbble
*/
angular.module('Services',[])
.factory('popularShotsService', ['$http', function($http){
	var popularShotsRequest = function(page){
		return $http({
			method: 'JSONP',
			url: 'https://api.dribbble.com/shots/popular?page='+ page +'&callback=JSON_CALLBACK'
		});
	};
	return {
		event: function(page){
			return popularShotsRequest(page);
		}
	}
}]);

/**
* Main Module
*/
var app = angular.module('Dribbble', ['Services','ngRoute']);

/**
* Config - Single Page Application
* $routeProvider
* description: To define the routes the page application
**/
app.config(function($routeProvider){
	$routeProvider
	.when('/', {templateUrl:'partials/popularShots.html'})
	.when('/popularShot/details', {templateUrl:'partials/detailspopularShots.html', controller:'detailspopularShots'})
	.otherwise({redirectTo:'/'})
});

/**
* popularShotsController
* description: bring popular shots
**/
app.controller('popularShotsController', function($scope, popularShotsService){
	var doc = document,
	docBody = document.body;
	
	$scope.page = 1;
	$scope.popShots = null;
	$scope.detailsShot = null;
	$scope.modal = 'partials/modalPopShots.html';
	
	/**
	* Masonry
	* Breakpoints Grid
	*/
	doc.addEventListener('DOMContentLoaded', function(){
		var elem = doc.querySelector('.grid');
		var msnry = new Masonry( elem, {
		  itemSelector: '.grid-item',
		  columnWidth: 220
		});	
	});


	/*
	* Watch the changes at page model and 
	* pass success data to the services.
	*/
	$scope.$watch('page', function(newPage){
		if(newPage){
			/*
			* popularShotsService
			* take the popular shots
			*/
			popularShotsService.event(newPage).success(function(data,status) {
				$scope.totalPages = data.pages;
				$scope.popShots = data.shots;
			});
		
		}
	});

	/*
	* initialPage()
	* description: go to initial page
	*/
	$scope.initialPage = function(){
		$scope.page =1;
	};

	/*
	* prev()
	* description: previus page
	*/
	$scope.prev = function(pg){
		var count = 1;
		count = pg - 1

		if(count < 1){
			$scope.page = 1;
		}else{
			$scope.page = count;	
			docBody.scrollTop = doc.documentElement.scrollTop = 0;
		}
	};

	/*
	* next()
	* description: next page
	*/
	$scope.next = function(pg){
		var count = 1;
		count = pg + 1
		
		if(count > $scope.totalPages){
			$scope.page = $scope.totalPages;
		}else{
			$scope.page = count;	
			docBody.scrollTop = doc.documentElement.scrollTop = 0;
		}
	};

	/**
	* showDetails()
	* description: show details of owner
	*/
	$scope.showDetails = function(index){
		$scope.detailsShot = $scope.popShots[index];		
	};

});

app.controller('detailspopularShots', function($scope, popularShotsService){
	$scope.showDetails = $scope.detailsShot;
	var descript = $scope.detailsShot.description;
	$scope.showDetailsDescription = descript.replace(/(<([^>]+)>)/ig,"");

});