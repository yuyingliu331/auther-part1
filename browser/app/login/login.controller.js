'use strict';

app.controller('LoginCtrl', function($scope, authFactory) {
	$scope.submitLogin = authFactory.login;
});
