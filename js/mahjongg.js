var App = Ember.Application.create();

App.Tile = Ember.Object.extend({
    i: -1,
    j: -1,
    k: -1,
    tile: -1,
    selected: false,
    visible: true,
    clickable: true,

    cssClass: (function () {
        return 'tile-' + this.get('tile');
    }).property('cssClass'),

    // style for tile positioning
    css: (function () {
        var pos_x = 36 * this.get('i');
        var pos_y = 48 * this.get('j');
        var img_offset = -36 * this.get('tile');
        var z_index = 100;
        return 'left:' + pos_x + 'px;top:' + pos_y + 'px;z-index:' + z_index + ';';
    }).property('css')

});

App.IndexRoute = Ember.Route.extend({
    setupController: function (controller) {
        var tiles = [
            App.Tile.create({i: 1, j: 1, k: 1, tile: 1}),
            App.Tile.create({i: 2, j: 2, k: 1, tile: 2})
        ];

        controller.set('content', Em.A(tiles));
    }
});

App.IndexController = Ember.ArrayController.extend({
    actions: {
        clickTile: function (tile) {
            tile.set('selected', !tile.get('selected'));
        }
    }
});

App.IndexView = Ember.View.extend({

});
