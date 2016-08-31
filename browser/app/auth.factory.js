
app.factory('authFactory', function($http, $state, $log) {
	var auth = {};

	auth.user = null;

	auth.getCurrentUser = function() {
		if (auth.user) {
					console.log("this is the user getCurrentUser admin", auth.user.isAdmin);
		}

		return auth.user;
	};

	auth.loadCurrentUser = function(){
		$http.get('/auth/me')
		.then(function(user){
			auth.user = user;
		})
		.catch($log.error);
	}

	auth.signup = function(email, password) {
		$http.post('/api/users', { email: email, password: password })
		.then(function(response) {
			auth.user = response.data;
			console.log("this is the user: ", auth.user);
		   $state.go('stories');
		}).catch($log.error);
	};

	auth.login = function(email, password) {
		console.log("email", email);
		console.log("password", password);
		$http.post('/login', { email: email, password: password })
		.then(function(response) {
			auth.user = response.data;
			console.log("this is the user login", auth.user);
		   $state.go('stories');
		}).catch($log.error);
	};

	auth.logout = function() {
		$http.get('/logout').then(function() {
			auth.user = null;
			$state.go('login');
		});
	};

	return auth;
});
