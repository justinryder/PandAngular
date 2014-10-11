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
        data: data,
        axis: {
          x: {
            label: 'hour',
            type: 'timeseries',
            tick: {
              format: function(x) {
                return x.getHours();
              }
            }
          },
          y: {
            label: 'kwh'
          }
        },
        data: data,
        subchart: {
          show: true
        },
        zoom: {
          enabled: true
        }
      });
    }
  };
}]);