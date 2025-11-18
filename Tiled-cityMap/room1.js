// ================= ROOM 1 SCENE =================
class room1 extends Phaser.Scene {
  constructor() {
    super({ key: "room1" });
  }

  preload() {
    this.load.tilemapTiledJSON("map2", "assets/map2.tmj");
    this.load.image("campingIMG", "assets/11_Camping_32x32.png");
    this.load.image("forestIMG", "assets/forest_tiles.png");
    this.load.image("desert1IMG", "assets/desert1.png");

    this.load.spritesheet("john", "assets/john.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create(data) {
    console.log("*** room1 scene started ***");

    // Load map and tiles
    const map = this.make.tilemap({ key: "map2" });
    const tilesArray = [
      map.addTilesetImage("11_Camping_32x32", "campingIMG"),
      map.addTilesetImage("forest_tiles", "forestIMG"),
      map.addTilesetImage("desert1", "desert1IMG"),
    ];

    // Create layers
    map.createLayer("backgroundlayer", tilesArray, 0, 0);
    map.createLayer("waterlayer", tilesArray, 0, 0);
    map.createLayer("grasslayer", tilesArray, 0, 0);
    map.createLayer("mountainlayer", tilesArray, 0, 0);
    map.createLayer("mountainlayer1", tilesArray, 0, 0);
    map.createLayer("mountainlayer2", tilesArray, 0, 0);
    map.createLayer("watergrass", tilesArray, 0, 0);
    map.createLayer("rocklayer", tilesArray, 0, 0);
    map.createLayer("treelayer", tilesArray, 0, 0);

    // Find start object in Tiled
    const start = map.findObject("objectLayer", (obj) => obj.name === "start");
    let playerX = start ? start.x : (data?.x || 200);
    let playerY = start ? start.y : (data?.y || 200);

    // Create player
    this.player = this.physics.add.sprite(playerX, playerY, "john");
    window.player = this.player;
    console.log("Player created at:", playerX, playerY);

    // Player animations
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

    // Input and camera follow
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
      this.player.x >= 1643 &&
      this.player.x <= 1629 &&
      this.player.y >= 693 &&
      this.player.y <= 260
    ) {
      console.log("Transitioning to room2...");
      this.scene.start("room2", { playerX: this.player.x, playerY: this.player.y });
    }
  }
}

