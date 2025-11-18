// ================= WORLD SCENE =================
class world extends Phaser.Scene {
  constructor() {
    super({ key: "world" });
  }

  preload() {
    this.load.tilemapTiledJSON("map1", "assets/map.tmj");
    this.load.image("campingIMG", "assets/11_Camping_32x32.png");
    this.load.image("forestIMG", "assets/forest_tiles.png");
    this.load.image("plantIMG", "assets/plant.png");
    this.load.image("trees-greenIMG", "assets/trees-green.png");
    this.load.image("desert2IMG", "assets/desert2.png");
    this.load.spritesheet("john", "assets/john.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    console.log("*** world scene ***");

    // Create map
    const map = this.make.tilemap({ key: "map1" });
    const tilesArray = [
      map.addTilesetImage("11_Camping_32x32", "campingIMG"),
      map.addTilesetImage("forest_tiles", "forestIMG"),
      map.addTilesetImage("plant", "plantIMG"),
      map.addTilesetImage("trees-green", "trees-greenIMG"),
      map.addTilesetImage("desert2", "desert2IMG"),
    ];

    map.createLayer("backgroundlayer", tilesArray, 0, 0);
    map.createLayer("waterlayer", tilesArray, 0, 0);
    map.createLayer("grasslayer", tilesArray, 0, 0);
    map.createLayer("bigtree", tilesArray, 0, 0);
    map.createLayer("bigtree1", tilesArray, 0, 0);
    map.createLayer("bigtree2", tilesArray, 0, 0);

    // Find start object
    const start = map.findObject("objectLayer", (obj) => obj.name === "start");
    if (!start) {
      console.error("Start object not found in the map.");
      return;
    }

    // Create player at start position
    this.player = this.physics.add.sprite(start.x, start.y, "john");
    window.player = this.player;
    console.log("Player created at:", start.x, start.y);

    // Player animations
    this.anims.create({
      key: "john-up",
      frames: this.anims.generateFrameNumbers("john", { start: 105, end: 112 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "john-left",
      frames: this.anims.generateFrameNumbers("john", { start: 118, end: 125 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "john-down",
      frames: this.anims.generateFrameNumbers("john", { start: 131, end: 138 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "john-right",
      frames: this.anims.generateFrameNumbers("john", { start: 144, end: 151 }),
      frameRate: 5,
      repeat: -1,
    });

    // Input and camera
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);
  }

  update() {
    if (!this.player) return; // safety check

    const speed = 200;
    this.player.setVelocity(0);

    // Movement controls
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play("john-left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play("john-right", true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play("john-up", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play("john-down", true);
    } else {
      this.player.anims.stop();
    }

    // Transition trigger
    if (
      this.player.x >= 840 &&
      this.player.x <= 880 &&
      this.player.y <= 250
    ) {
      console.log("Transitioning to room1...");
      this.scene.start("room1", { playerX: this.player.x, playerY: this.player.y });
    }
  }
}
