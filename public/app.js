App = Ember.Application.create();
App.Router.map(function() {

});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        var url = 'https://lcboapi.com/stores/411/products?access_key=MDplMGI1YTk5OC0yNDlkLTExZTYtOWViYy0wMzVmNTdmYjRmMzU6QngxdFc0Qlo3OEFhSDdHMnU0aVpBYUNFSHVSYWRzdkp2Yzdh&where=has_limited_time_offer&q=wine&per_page=100';
        var products = Ember.$.getJSON(url).then(function(data) {
            return data.result;
        });
        return products;
    }
});