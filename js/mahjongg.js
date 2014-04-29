var Mahjongg = Ember.Application.create();

Mahjongg.Tile = Ember.Object.extend({
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
        var pos_x = 50 + 18 * this.get('i');
        var pos_y = 48 + 24 * this.get('j');
        var z_index = 2 * this.get('k') + 1;
        return 'left:' + pos_x + 'px;top:' + pos_y + 'px;z-index:' + z_index + ';';
    }).property('position'),

    // style for shadow positioning
    // @todo move to view
    shadowPosition: (function () {
        var pos_x = 50 + 18 * this.get('i');
        var pos_y = 48 + 24 * this.get('j');
        var z_index = 2 * this.get('k');
        return 'left:' + pos_x + 'px;top:' + pos_y + 'px;z-index:' + z_index + ';';
    }).property('shadowPosition')
});

Mahjongg.Board = Ember.Object.extend({
    width: 30,
    height: 16,
    depth: 5,
    generate: function () {
        var tiles = [];
        for (var i = 0; i < this.get('width'); i++) {
            tiles[i] = [];
            for (var j = 0; j < this.get('height'); j++) {
                tiles[i][j] = [];
                for (var k = 0; k < this.get('depth'); k++) {
                    tiles[i][j][k] = undefined;
                }
            }
        }
        this.set('tiles', tiles);
    },
    createLayout: function () {
        var i, j;
        for (i = 1; i <= 12; i++) {
            this.putTile(i * 2, 0 * 2, 0);
            this.putTile(i * 2, 3 * 2, 0);
            this.putTile(i * 2, 4 * 2, 0);
            this.putTile(i * 2, 7 * 2, 0);
        }
        for (i = 3; i <= 10; i++) {
            this.putTile(i * 2, 1 * 2, 0);
            this.putTile(i * 2, 6 * 2, 0);
        }

        for (i = 2; i <= 11; i++) {
            this.putTile(i * 2, 2 * 2, 0);
            this.putTile(i * 2, 5 * 2, 0);
        }

        this.putTile(0 * 2, 3 * 2 + 1, 0);
        this.putTile(13 * 2, 3 * 2 + 1, 0);
        this.putTile(14 * 2, 3 * 2 + 1, 0);

        // Layer 1
        for (i = 4; i <= 9; i++) {
            for (j = 1; j <= 6; j++) {
                this.putTile(i * 2, j * 2, 1);
            }
        }

        // Layer 2
        for (i = 5; i <= 8; i++) {
            for (j = 2; j <= 5; j++) {
                this.putTile(i * 2, j * 2, 2);
            }
        }

        // Layer 3
        for (i = 6; i <= 7; i++) {
            for (j = 3; j <= 4; j++) {
                this.putTile(i * 2, j * 2, 3);
            }
        }

        // Layer 4
        this.putTile(6 * 2 + 1, 3 * 2 + 1, 4);
    },
    putTile: function (i, j, k) {
        var tiles = this.get('tiles');
        tiles[i][j][k] = -1;
    },
    randomizeLayout: function () {
        var N, idx, i, j, k;
        var tiles = this.get('tiles');
        var width = this.get('width');
        var height = this.get('height');
        var depth = this.get('depth');
        for (N = 1; N <= 34; N++) {
            for (idx = 0; idx < 4; idx++) {
                do
                {
                    i = Math.floor((Math.random() * width));
                    j = Math.floor((Math.random() * height));
                    k = Math.floor((Math.random() * depth));
                } while (!tiles[i][j][k] || tiles[i][j][k] != -1);
                tiles[i][j][k] = Mahjongg.Tile.create({i: i, j: j, k: k, tile: N});
            }
        }

        for (N = 35; N <= 42; N++) {
            do
            {
                i = Math.floor((Math.random() * width));
                j = Math.floor((Math.random() * height));
                k = Math.floor((Math.random() * depth));
            } while (!tiles[i][j][k] || tiles[i][j][k] != -1);
            tiles[i][j][k] = Mahjongg.Tile.create({i: i, j: j, k: k, tile: N});
        }
    },
    tilesArray: (function () {
        var result = [];
        var tiles = this.get('tiles');
        for (var i = 0; i < this.get('width'); i++) {
            for (var j = 0; j < this.get('height'); j++) {
                for (var k = 0; k < this.get('depth'); k++) {
                    if (tiles[i][j][k]) {
                        result.push(tiles[i][j][k]);
                    }
                }
            }
        }
        return result;
    }).property('tilesArray')
});

Mahjongg.IndexRoute = Ember.Route.extend({
    setupController: function (controller) {
        Ember.run(function () {
            // create board
            var board = Mahjongg.Board.create();
            board.generate();
            board.createLayout();
            board.randomizeLayout();
            controller.set('content', board);
            controller.set('state', 'game');
        });
    }
});

Mahjongg.IndexController = Ember.Controller.extend({
    state: 'loading',
    actions: {
        clickTile: function (tile) {
            tile.set('selected', !tile.get('selected'));
        }
    }
});
