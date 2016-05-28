App = Ember.Application.create();
App.Router.map(function() {

});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        var url = 'https://lcboapi.com/stores/411/products?access_key=MDowOTQ3OGUzNi0yNDlkLTExZTYtYjM1Yi00ZjQxODkxMDU1MWY6Umt5UnhOc2dZZ01QOVZhbXpGbGFDb05heHZwODNwcG9wQmt0&where=has_limited_time_offer&q=wine&per_page=100';
        var products = Ember.$.getJSON(url).then(function(data) {
            return data.result;
        });
        return products;
    }
});