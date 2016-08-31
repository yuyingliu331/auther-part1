'use strict';

app.controller('UserListCtrl', function ($scope, users, User, authFactory) {
  $scope.users = users;
  $scope.addUser = function () {
    $scope.userAdd.save()
    .then(function (user) {
      $scope.userAdd = new User();
      $scope.users.unshift(user);
    });
  };

  $scope.user = authFactory.getCurrentUser()

  if ($scope.user) {
    $scope.admin = $scope.user.isAdmin;
  }

  $scope.userSearch = new User();

  $scope.userAdd = new User();
});
