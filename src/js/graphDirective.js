app.directive('graph', [function($window) {
  return{
    restrict: 'EA',
    controller: 'graphController',
    link: function(scope, elem, attrs){
      var data = scope.data;

      var chart = c3.generate({
        bindto: '#' + elem.attr('id'),
        data: data
      });
    }
  };
}]);