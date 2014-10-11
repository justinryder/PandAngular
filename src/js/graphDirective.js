app.directive('graph', [function($window) {
  return{
    restrict: 'EA',
    controller: 'graphController',
    scope: {
      chart: '=',
      data: '='
    },
    link: function(scope, elem, attrs){
      var data = scope.data;

      scope.chart = c3.generate({
        bindto: '#' + elem.attr('id'),
        data: data
      });
    }
  };
}]);