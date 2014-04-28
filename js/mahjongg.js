var App = Ember.Application.create();

App.Tile = Ember.Object.extend({
    i: -1,
    j: -1,
    k: -1,
    tile: -1,
    selected: false,
    visible: true,
    clickable: true,

    // css class for background image
    // @todo move to view
    cssClass: (function () {
        return 'tile-' + this.get('tile');
    }).property('cssClass'),

    // style for tile positioning
    // @todo move to view
    position: (function () {
        var pos_x = 18 + 36 * this.get('i');
        var pos_y = 24 + 48 * this.get('j');
        var img_offset = -36 * this.get('tile');
        var z_index = 100;
        return 'left:' + pos_x + 'px;top:' + pos_y + 'px;z-index:' + z_index + ';';
    }).property('position')
});

App.Board = Ember.Object.extend({
    tiles: Em.A([]),
    generate: function () {
        var tiles = Em.A([]);
        for (i = 1; i <= 42; i++) {
            tiles.push(App.Tile.create({i: (i - 1) % 10, j: Math.floor((i - 1) / 10), k: 1, tile: i}));
        }
        this.set('tiles', tiles);
    },
    placeTiles: function () {

    }
});

App.IndexRoute = Ember.Route.extend({
    setupController: function (controller) {
        Ember.run(function () {
            // create board
            var board = App.Board.create();
            board.generate();
            board.placeTiles();
            controller.set('content', board);
            controller.set('state', 'game');
        });
    }
});

App.IndexController = Ember.Controller.extend({
    state: 'loading',
    actions: {
        clickTile: function (tile) {
            tile.set('selected', !tile.get('selected'));
        }
    }
});
