App = Ember.Application.create();
App.Router.map(function() {

});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        var url = 'https://codybo.herokuapp.com/lcbo/411';
        var products = Ember.$.getJSON(url).then(function(data) {
            return data;
        });
        return products;
    }
});
