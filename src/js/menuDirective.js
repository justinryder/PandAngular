app.directive('menu', [function($window) {
  return{
    restrict: 'EA',
    controller: 'controlsController',
    scope: {
      chart: '=',
      data: '=',
      showMenu: '='
    },
    link: function(scope, elem, attrs){
      $(document).foundation({tab: {toggleable: false}});
        

    }
  };
}]);