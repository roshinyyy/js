class world extends Phaser.Scene {
  constructor() {
    super({
      key: "world",
    });

    // Put global variable here
  }

  preload() {
    // Step 1, load JSON
    //this.load.tilemapTiledJSON("world1", "assets/Tutorial1.json");

    this.load.tilemapTiledJSON("world1", "assets/mainmap.json");



    // Step 2 : Preload any images here
    //this.load.image("building", "assets/Buildings32x32.png");
    //this.load.image("street", "assets/Street32x32.png");

    this.load.image("tilesetIMG", "assets/tileset1.png")
    this.load.image("pipoyaIMG", "assets/pipoya.png")
  }
  

  create() {
    console.log("*** world scene");

    //Step 3 - Create the map from main
    //let map = this.make.tilemap({ key: "world1" });
    let map = this.make.tilemap({ key: "world1" });

    // Step 4 Load the game tiles
    // 1st parameter is name in Tiled,
    // 2nd parameter is key in Preload
    //let buildingTiles = map.addTilesetImage("Buildings32x32", "building");
    let tileset1Tiles = map.addTilesetImage("tileset1", "tilesetIMG");
    let pipoyaTiles = map.addTilesetImage("pipoya", "pipoyaIMG");
    //let streetTiles = map.addTilesetImage("Street32x32", "street");

    // Step 5  create an array of tiles
    // let tilesArray = [
    //   buildingTiles,
    //   streetTiles,
    let tilesArray = [tileset1Tiles,pipoyaTiles];

    // Step 6  Load in layers by layers
    //this.groundLayer = map.createLayer("groundLayer",tilesArray,0,0);
    this.originalfloor = map.createLayer("originalfloor",tilesArray,0,0);


    //this.streetLayer = map.createLayer("streetLayer",tilesArray,0,0);

    //this.buildingLayer = map.createLayer("buildingLayer",tilesArray,0,0);

    // Add main player here with physics.add.sprite

    // Add time event / movement here

    // get the tileIndex number in json, +1
    //mapLayer.setTileIndexCallback(11, this.room1, this);

    // Add custom properties in Tiled called "mouintain" as bool

    // What will collider witg what layers
    //this.physics.add.collider(mapLayer, this.player);

    // create the arrow keys
    //this.cursors = this.input.keyboard.createCursorKeys();

    // camera follow player
    //this.cameras.main.startFollow(this.player);
  } /////////////////// end of create //////////////////////////////

  update() {} /////////////////// end of update //////////////////////////////

} //////////// end of class world ////////////////////////
