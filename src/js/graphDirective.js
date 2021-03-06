app.directive('graph', [function($window) {
  return{
    restrict: 'EA',
    controller: 'graphController',
    scope: {
      chart: '=',
      data: '='
    },
    link: function(scope, elem, attrs){
      scope.chart = c3.generate({
        bindto: '#' + elem.attr('id'),
        data: scope.data,
        axis: {
          x: {
            label: 'Year'
            /*label: 'hour',
            type: 'timeseries',
            tick: {
              format: function(x) {
                return x.getHours();
              }
            }*/
          },
          y: {
            label: 'Trillion BTU'
          }
        },
        grid: {
          x: {
            lines: [{ value: new Date().getFullYear(), text: 'Today' }]
          }
        },
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