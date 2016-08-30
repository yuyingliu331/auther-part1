
app.factory('authFactory', function($http, $state, $log) {
	var auth = {};

	auth.signup = function(email, password) {
		$http.post('/api/users', { email: email, password: password })
		.then(function() {
		   $state.go('stories')
		}).catch($log.error)
	};

	auth.login = function(email, password) {
		$http.post('/login', { email: email, password: password })
		.then(function() {
		   $state.go('stories')
		}).catch($log.error)
	};

	return auth;
});