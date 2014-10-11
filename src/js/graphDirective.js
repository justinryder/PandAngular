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
        subchart: {
          show: true
        },
        zoom: {
          enabled: true
        },
        grid: {
          x: {
            lines: [
              { value: new Date(Date.parse('3/1/2013 10:45')), text: 'Consumption Event 1' },
              { value: new Date(Date.parse('3/1/2013 17:45')), text: 'Consumption Event 2' }
            ]
          }
        }
      });
    }
  };
}]);