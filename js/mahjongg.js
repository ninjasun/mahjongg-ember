var Mahjongg = Ember.Application.create();

// tile object
Mahjongg.Tile = Ember.Object.extend({
    board: undefined,
    i: -1,
    j: -1,
    k: -1,
    tile: -1, // tile value
    selected: false,
    visible: true,

    // check if the tile clickable
    // update on total count of tiles is changed
    clickable: (function () {
        return this.get('board').isTileFree(this);
    }).property('board.tilesCount')
});

Mahjongg.Board = Ember.Object.extend({
    width: 30,
    height: 16,
    depth: 5,
    tilesCount: 0,

    // generate tiles array
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

    // create classic mahjongg layout
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

    // put tile placeholder on board
    putTile: function (i, j, k) {
        var tiles = this.get('tiles');
        tiles[i][j][k] = -1;
    },

    // randomize tiles, set up all objects
    randomizeLayout: function () {
        var N, idx, i, j, k;
        var tiles = this.get('tiles');
        var width = this.get('width');
        var height = this.get('height');
        var depth = this.get('depth');
        var count = 0;
        for (N = 1; N <= 34; N++) {
            for (idx = 0; idx < 4; idx++) {
                do
                {
                    i = Math.floor((Math.random() * width));
                    j = Math.floor((Math.random() * height));
                    k = Math.floor((Math.random() * depth));
                } while (!tiles[i][j][k] || tiles[i][j][k] != -1);
                tiles[i][j][k] = Mahjongg.Tile.create({i: i, j: j, k: k, tile: N, board: this});
                count++;
            }
        }

        for (N = 35; N <= 42; N++) {
            do
            {
                i = Math.floor((Math.random() * width));
                j = Math.floor((Math.random() * height));
                k = Math.floor((Math.random() * depth));
            } while (!tiles[i][j][k] || tiles[i][j][k] != -1);
            tiles[i][j][k] = Mahjongg.Tile.create({i: i, j: j, k: k, tile: N, board: this});
            count++;
        }

        this.set('tilesCount', count);
    },

    // return all tiles as array
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
        return Em.A(result);
    }).property(),

    // check if i coordinate is valid
    isCoordValid: function (i, j, k) {
        return (i >= 0 && i < 30) && (j >= 0 && j < 16) && (k >= 0 && k < 5);
    },

    // check if the tile is free
    isTileFree: function (tile) {
        var i0, j0;
        var i = tile.get('i');
        var j = tile.get('j');
        var k = tile.get('k');
        var tiles = this.get('tiles');

        // check upper layer
        if (k < this.get('depth') - 1) {
            for (i0 = -1; i0 <= 1; i0++) {
                for (j0 = -1; j0 <= 1; j0++) {
                    if (this.isCoordValid(i + i0, j + j0, k + 1)) {
                        if (tiles[i + i0][j + j0][k + 1] && tiles[i + i0][j + j0][k + 1].get('visible'))
                            return false;
                    }
                }
            }
        }

        var hasLeft = false;
        var hasRight = false;

        for (j0 = -1; j0 <= 1; j0++) {
            if (this.isCoordValid(i - 2, j + j0, k)) {
                if (tiles[i - 2][j + j0][k] && tiles[i - 2][j + j0][k].get('visible')) {
                    hasLeft = true;
                }
            }

            if (this.isCoordValid(i + 2, j + j0, k)) {
                if (tiles[i + 2][j + j0][k] && tiles[i + 2][j + j0][k].get('visible')) {
                    hasRight = true;
                }
            }
        }

        // Check left/right
        if (hasLeft && hasRight)
            return false;

        return true;
    },

    // compare two tile values
    areTilesEqual: function (tile1, tile2) {
        var t1 = tile1.get('tile');
        var t2 = tile2.get('tile');

        // ordinary tiles
        if (t1 < 35 && t2 < 35)
            return (t1 == t2);

        // seasons
        if (t1 >= 35 && t1 <= 38 && t2 >= 35 && t2 <= 38)
            return true;

        // flowers
        if (t1 >= 39 && t1 <= 42 && t2 >= 39 && t2 <= 42)
            return true;

        return false;
    }
});

Mahjongg.IndexRoute = Ember.Route.extend({
    setupController: function (controller) {
        controller.send('newGame');
    }
});

Mahjongg.IndexController = Ember.Controller.extend({
    state: 'game-won',
    selectedTile: undefined,
    actions: {
        // start new game
        newGame: function () {
            this.set('state', 'loading');
            var controller = this;
            Ember.run.later(function () {
                var board = Mahjongg.Board.create();
                board.generate();
                board.createLayout();
                board.randomizeLayout();
                controller.set('board', board);
                controller.set('state', 'game');
            }, 500);
        },

        // click tile event
        clickTile: function (tile) {
            var board = this.get('board');

            var selectedTile = this.get('selectedTile');

            if (!selectedTile) {
                // don't have selected tile yet, just select and return
                this.set('selectedTile', tile);
                tile.set('selected', true);
                return;
            }

            if (selectedTile == tile) {
                // second click on selected tile, unselect it and return
                this.set('selectedTile', undefined);
                tile.set('selected', false);
                return;
            }

            if (!board.areTilesEqual(tile, selectedTile)) {
                // different tiles, do nothing
                return;
            }

            // tiles are equal, remove them
            tile.set('visible', false);

            // unselect and hide selected tile
            selectedTile.set('visible', false);
            selectedTile.set('selected', false);

            // clear current selected tile
            this.set('selectedTile', undefined);

            // Update tiles count
            var tilesCount = board.get('tilesCount') - 2;
            board.set('tilesCount', tilesCount);

            // if no tiles left, update game status
            if (tilesCount == 0) {
                this.set('state', 'game-won')
            }
        }
    }
});

Mahjongg.BoardView = Ember.View.extend({
    tagName: 'section',
    templateName: 'board',
    classNameBindings: [':board', 'controller.state']
});

Mahjongg.TileView = Ember.View.extend({
    tagName: 'span',
    classNameBindings: [':tile', 'tileClass', 'tile.visible', 'tile.clickable', 'tile.selected'],
    attributeBindings: ["style"],

    click: function () {
        var tile = this.get('tile');
        if (tile.get('clickable')) {
            this.get('controller').send('clickTile', tile);
        }
    },

    // css class for background image
    tileClass: (function () {
        return 'tile-' + this.get('tile').get('tile');
    }).property(),

    style: function () {
        var pos_x = 50 + 18 * this.get('tile').get('i');
        var pos_y = 48 + 24 * this.get('tile').get('j');
        var z_index = 2 * this.get('tile').get('k') + 1;
        return 'left:' + pos_x + 'px;top:' + pos_y + 'px;z-index:' + z_index + ';';
    }.property()
});

Mahjongg.ShadowView = Ember.View.extend({
    tagName: 'span',
    classNameBindings: [':tile-shadow', 'tile.visible', 'tile.selected'],
    attributeBindings: ["style"],
    style: function () {
        var pos_x = 50 + 18 * this.get('tile').get('i');
        var pos_y = 48 + 24 * this.get('tile').get('j');
        var z_index = 2 * this.get('tile').get('k');
        return 'left:' + pos_x + 'px;top:' + pos_y + 'px;z-index:' + z_index + ';';
    }.property()
});
