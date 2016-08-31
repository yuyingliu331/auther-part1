'use strict';

app.directive('navbar', function ($state, $location, authFactory) {
  return {
    restrict: 'E',
    templateUrl: '/browser/components/navbar/navbar.html',
    link: function (scope) {
      scope.pathStartsWithStatePath = function (state) {
        var partial = $state.href(state);
        var path = $location.path();
        return path.startsWith(partial);
      };

      scope.getCurrentUser = authFactory.getCurrentUser;

      scope.logout = function() {
        authFactory.logout();
      };
    }
  }
});
