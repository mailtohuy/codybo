App = Ember.Application.create();
App.Router.map(function() {

});  
App.IndexRoute = Ember.Route.extend({
    model: function() {
        var url = 'https://lcboapi.com/stores/411/products?access_key=MDoxMzM1YjdiYS0yMjlmLTExZTYtOTEyYS04Zjc5ZTE4MmM5ZTE6dGF5dDZSZzZ2ZHF0ajN4ZWE5UXQxYXQyNHpja1laTjZleDBs&where=has_limited_time_offer&q=wine&per_page=100';
        var products = Ember.$.getJSON(url).then(function(data) {
            return data.result;
        });
        return products;
    }
});