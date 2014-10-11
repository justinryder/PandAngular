app.directive('graph', [function($window) {
  return{
    restrict: 'E',
    controller: 'graphController',
    scope: {
      chart: '='
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