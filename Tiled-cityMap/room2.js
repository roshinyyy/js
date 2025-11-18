// ================= ROOM 2 SCENE =================
class Room2 extends Phaser.Scene {
  constructor() {
    super({ key: "Room2" }); // key must match scene.start()
  }

  preload() {
    // Load tilemap and tilesets
    this.load.tilemapTiledJSON("map3", "assets/map3.tmj");
    this.load.image("campingIMG", "assets/11_Camping_32x32.png");
    this.load.image("forestIMG", "assets/forest_tiles.png");
    this.load.image("desert1IMG", "assets/desert1.png");

    // Load player sprite
    this.load.spritesheet("john", "assets/john.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create(data) {
    console.log("*** Room2 scene started ***");

    // Load map
    const map = this.make.tilemap({ key: "map3" });
    const tilesArray = [
      map.addTilesetImage("11_Camping_32x32", "campingIMG"),
      map.addTilesetImage("forest_tiles", "forestIMG"),
      map.addTilesetImage("desert1", "desert1IMG"),
    ];

    // Create layers (layer names must match exactly from Tiled)
    map.createLayer("background layer", tilesArray, 0, 0);
    map.createLayer("waterlayer", tilesArray, 0, 0);
    map.createLayer("watergrass", tilesArray, 0, 0);
    map.createLayer("rocklayer", tilesArray, 0, 0);
    map.createLayer("treelayer", tilesArray, 0, 0);

    // Spawn player (use data from previous scene)
    const startX = data.playerX || 876; // fallback default
    const startY = data.playerY || 200;

    this.player = this.physics.add.sprite(startX, startY, "john");
    this.player.setCollideWorldBounds(true);
    window.player = this.player;

    console.log(`Player spawn: x=${this.player.x}, y=${this.player.y}`);

    // Camera follow
    this.cameras.main.startFollow(this.player);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Animations
    this.createAnimations();
  }

  createAnimations() {
    this.anims.create({
      key: "john-left",
      frames: this.anims.generateFrameNumbers("john", { start: 118, end: 125 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "john-up",
      frames: this.anims.generateFrameNumbers("john", { start: 92, end: 99 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "john-down",
      frames: this.anims.generateFrameNumbers("john", { start: 105, end: 112 }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "john-right",
      frames: this.anims.generateFrameNumbers("john", { start: 131, end: 138 }),
      frameRate: 5,
      repeat: -1,
    });
  }

  update() {
    if (!this.player) return;

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

    // Transition back to Room1
    if (
      this.player.x >= 0 &&
      this.player.x <= 60 &&
      this.player.y >= 200 &&
      this.player.y <= 260
    ) {
      console.log("Returning to Room1...");
      this.scene.start("room1", { playerX: 1639, playerY: 623 }); 
    }
  }
}
