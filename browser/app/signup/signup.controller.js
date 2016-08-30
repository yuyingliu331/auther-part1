'use strict';

app.controller('SignupCtrl', function($scope, authFactory) {
	$scope.submitSignup = authFactory.signup;
});