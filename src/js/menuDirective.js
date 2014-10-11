app.directive('menu', [function($window) {
  return{
    restrict: 'EA',
    controller: 'graphController',
    scope: {
      chart: '=',
      data: '=',
      showMenu: '='
    },
    link: function(scope, elem, attrs){
      $(document)
        $(document).foundation({tab: {toggleable: false}});
        
      scope.data.onclick = function(data, element) {
        console.log(data);
      };
    }
  };
}]);