var promise = Kinvey.init({
    appKey    : 'kid_Te2h2J3XYq',
    appSecret : 'db716c444cb347fb924f926d2d061a75'
});
promise.then(function(activeUser) {
    ...
}, function(error) {
    ...
});

var promise = Kinvey.ping();
promise.then(function(response) {
    console.log('Kinvey Ping Success. Kinvey Service is alive, version: ' + response.version + ', response: ' + response.kinvey);
}, function(error) {
    console.log('Kinvey Ping Failed. Response: ' + error.description);
});