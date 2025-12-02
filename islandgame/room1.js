// ================= ROOM 1 SCENE =================
class room1 extends Phaser.Scene {
  constructor() {
    super({ key: "room1" });

    // Health and invulnerability
    this.maxLives = 3;
    this.lives = 3;
    this.playerHit = false;

    // Tools collected
    this.axe = false;
    this.hammer = false;
    this.medkit = false;

    // Collision layers
    this.collisionLayers = [];

    // Inventory
    this.itemMaxCount = 3;
    this.itemCounts = { axe: 0, hammer: 0, medkit: 0 };
  }

  init(data) {
    this.lives = typeof data?.health === "number" ? data.health : this.lives;
    this.axe = data?.axe || this.axe;
    this.hammer = data?.hammer || this.hammer;
    this.medkit = data?.medkit || this.medkit;
    this.playerX = data?.playerX || null;
    this.playerY = data?.playerY || null;
    this.itemCounts = data?.itemCounts || this.itemCounts;
    this.playerHit = false;
  }

  preload() {
    // ===== Tilemaps & Tiles =====
    this.load.tilemapTiledJSON("map2", "assets/map2.tmj");
    this.load.image("campingIMG", "assets/11_Camping_32x32.png");
    this.load.image("forestIMG", "assets/forest_tiles.png");
    this.load.image("plantIMG", "assets/plant.png");
    this.load.image("trees-greenIMG", "assets/trees-green.png");
    this.load.image("desert2IMG", "assets/desert2.png");

    // ===== Player =====
    this.load.spritesheet("john", "assets/john.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // ===== Enemies =====
    this.load.spritesheet("gorilla", "assets/gorilla.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("monkey", "assets/monkey.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // ===== Items =====
    this.load.spritesheet("axeSheet", "assets/axe.png", {
      frameWidth: 32,
      frameHeight: 26,
    });
    this.load.spritesheet("hammerSheet", "assets/hammer.png", {
      frameWidth: 32,
      frameHeight: 26,
    });
    this.load.spritesheet("medkitSheet", "assets/medkit.png", {
      frameWidth: 32,
      frameHeight: 26,
    });

    // ===== Heart =====
    this.load.image("heart", "assets/heart.png");

    // ===== Game Over =====
    this.load.image("gameover", "assets/gameover.jpg");
  }

  create() {
    const map = this.make.tilemap({ key: "map2" });
    const tilesArray = [
      map.addTilesetImage("11_Camping_32x32", "campingIMG"),
      map.addTilesetImage("forest_tiles", "forestIMG"),
      map.addTilesetImage("plant", "plantIMG"),
      map.addTilesetImage("trees-green", "trees-greenIMG"),
      map.addTilesetImage("desert2", "desert2IMG"),
    ];

    // ===== Create collision layers =====
    const collisionNames = [
      "backgroundlayer",
      "waterlayer",
      "grasslayer",
      "mountainlayer",
      "mountainlayer1",
      "mountainlayer2",
      "watergrass",
      "rocklayer",
      "treelayer",
    ];

    map.layers.forEach((layerData) => {
      if (!layerData || !layerData.name) return;
      const layer = map.createLayer(layerData.name, tilesArray, 0, 0);
      if (!layer) return;
      if (collisionNames.includes(layerData.name)) {
        layer.setCollisionByProperty({ collides: true });
        this.collisionLayers.push(layer);
      }
    });

    // ===== Player Spawn =====
    let spawn =
      this.playerX && this.playerY
        ? { x: this.playerX, y: this.playerY }
        : map.findObject("objectLayer", (obj) => obj.name === "start");
    if (!spawn || spawn.x === undefined || spawn.y === undefined) {
      console.error("Player spawn object not found or invalid!");
      return;
    }

    this.player = this.physics.add.sprite(spawn.x, spawn.y, "john");
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(32, 32);
    this.player.body.setOffset(16, 32);
    this.collisionLayers.forEach((layer) => {
      this.physics.add.collider(this.player, layer);
    });

    // ===== Player Animations =====
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

    // ===== Camera =====
    this.cameras.main.startFollow(this.player);
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    // ===== Enemies =====
    this.createEnemy(map, "gorilla");
    this.createEnemy(map, "monkey");

    // ===== Items =====
    this.items = this.physics.add.group();
    const axeObj = map.findObject("objectLayer", (obj) => obj.name === "axe");
    const hammerObj = map.findObject(
      "objectLayer",
      (obj) => obj.name === "hammer"
    );
    const medkitObj = map.findObject(
      "objectLayer",
      (obj) => obj.name === "medkit"
    );

    const createFloatingItem = (
      obj,
      key,
      scale = 1,
      floatHeight = 20,
      frame = 0
    ) => {
      if (!obj) return null;
      let item = this.items
        .create(obj.x, obj.y, key, frame)
        .setScale(2.5)
        .setOrigin(0, 1)
        .setDepth(10);
      item.body.setSize(item.width * scale, item.height * scale);
      this.tweens.add({
        targets: item,
        y: item.y - floatHeight,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
      return item;
    };

    // Only create items if they were NOT collected in world.js
    this.axeItem =
      this.itemCounts.axe < 1
        ? createFloatingItem(axeObj, "axeSheet", 1, 10)
        : null;
    this.hammerItem =
      this.itemCounts.hammer < 1
        ? createFloatingItem(hammerObj, "hammerSheet", 0.3, 20)
        : null;
    this.medkitItem =
      this.itemCounts.medkit < 1
        ? createFloatingItem(medkitObj, "medkitSheet", 1, 10)
        : null;

    this.physics.add.overlap(
      this.player,
      this.items,
      this.collectItem,
      null,
      this
    );

    this.axeItem = createFloatingItem(axeObj, "axeSheet", 1, 10);
    this.hammerItem = createFloatingItem(hammerObj, "hammerSheet", 0.3, 20);
    this.medkitItem = createFloatingItem(medkitObj, "medkitSheet", 1, 10);

    this.physics.add.overlap(
      this.player,
      this.items,
      this.collectItem,
      null,
      this
    );

    // ===== Lives UI =====
    this.createLivesUI();

    // ===== Inventory UI with numbers =====
    this.createInventoryUI();

    // Update inventory UI to show previously collected numbers
    this.updateInventoryUI();

    // ===== Input =====
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  // ===== Enemy helper =====
  createEnemy(map, name) {
    const spawn = map.findObject("objectLayer", (obj) => obj.name === name);
    if (!spawn) return;

    const enemy = this.physics.add.sprite(spawn.x, spawn.y, name);
    enemy.body.setSize(32, 44);
    enemy.body.setOffset(16, 20);
    enemy.body.immovable = true;

    if (!this.anims.exists(`${name}-walk`)) {
      this.anims.create({
        key: `${name}-walk`,
        frames: this.anims.generateFrameNumbers(name, { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1,
      });
    }
    enemy.anims.play(`${name}-walk`, true);

    this.physics.add.collider(
      this.player,
      enemy,
      this.handlePlayerHit,
      null,
      this
    );
    this[name] = enemy;

    if (name === "gorilla") {
      this.gorillaSpeed = 100;
      this.gorillaDirection = 1;
    }
    if (name === "monkey") {
      this.monkeySpeed = 60;
      this.monkeyDirection = 1;
      this.monkey.minY = spawn.y - 50;
      this.monkey.maxY = spawn.y + 50;
    }
  }

  // ===== Player hit =====
  handlePlayerHit(player, enemy) {
    if (this.playerHit) return;

    this.lives--;
    this.updateLivesDisplay();
    this.playerHit = true;
    player.setTint(0xff0000);

    if (this.lives <= 0) {
      this.gameOverImage = this.add
        .image(this.scale.width / 2, this.scale.height / 2, "gameover")
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(9999)
        .setDisplaySize(800, 600);
      player.setVelocity(0);
      this.physics.pause();

      this.restartKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
      this.restartKey.once("down", () => {
        this.scene.stop();
        this.scene.start("world");
      });
      return;
    }

    this.time.delayedCall(1500, () => {
      this.playerHit = false;
      player.clearTint();
    });
  }

  // ===== Collect item =====
  collectItem(player, item) {
    if (!item) return;
    if (item === this.axeItem) {
      this.axe = true;
      this.itemCounts.axe++;
    }
    if (item === this.hammerItem) {
      this.hammer = true;
      this.itemCounts.hammer++;
    }
    if (item === this.medkitItem) {
      this.medkit = true;
      this.itemCounts.medkit++;
      if (this.lives < this.maxLives) this.lives++;
      this.updateLivesDisplay();
    }
    item.destroy();
    this.updateInventoryUI();
  }

  // ===== Lives UI =====
  createLivesUI() {
    this.livesImages = [];
    const padding = 8;
    const heartSize = 40;
    const startX = this.scale.width - padding - heartSize;
    const startY = padding + 8;
    for (let i = 0; i < this.maxLives; i++) {
      const heart = this.add
        .image(startX - i * (heartSize + 6), startY, "heart")
        .setScrollFactor(0)
        .setDepth(9999)
        .setOrigin(0, 0)
        .setDisplaySize(heartSize, heartSize);
      this.livesImages.push(heart);
    }
    this.updateLivesDisplay = () => {
      for (let i = 0; i < this.maxLives; i++) {
        const img = this.livesImages[i];
        if (i < this.lives) {
          img.clearTint();
          img.setAlpha(1);
        } else {
          img.setTint(0x555555);
          img.setAlpha(0.45);
        }
      }
    };
    this.updateLivesDisplay();
  }

  // ===== Inventory UI =====
  createInventoryUI() {
    this.inventoryImages = [];
    this.inventoryTexts = [];
    const padding = 8;
    const inventoryKeys = ["axeSheet", "hammerSheet", "medkitSheet"];
    const itemNames = ["axe", "hammer", "medkit"];
    const inventorySize = 40;
    const startX = padding;
    const startY = padding + 8;
    for (let i = 0; i < inventoryKeys.length; i++) {
      const img = this.add
        .image(startX + i * (inventorySize + 50), startY, inventoryKeys[i])
        .setScrollFactor(0)
        .setDepth(9999)
        .setOrigin(0, 0)
        .setDisplaySize(inventorySize, inventorySize)
        .setTint(0xaaaaaa)
        .setAlpha(0.5);
      this.inventoryImages.push(img);

      const text = this.add
        .text(
          startX + i * (inventorySize + 50) + inventorySize + 5,
          startY + 5,
          `${this.itemCounts[itemNames[i]]}/${this.itemMaxCount}`,
          { fontSize: "16px", fill: "#ffffff" }
        )
        .setScrollFactor(0)
        .setDepth(9999);
      this.inventoryTexts.push(text);
    }

    this.updateInventoryUI = () => {
      for (let i = 0; i < this.inventoryImages.length; i++) {
        if ([this.axe, this.hammer, this.medkit][i]) {
          this.inventoryImages[i].clearTint();
          this.inventoryImages[i].setAlpha(1);
        } else {
          this.inventoryImages[i].setTint(0xaaaaaa);
          this.inventoryImages[i].setAlpha(0.5);
        }
        this.inventoryTexts[i].setText(
          `${this.itemCounts[itemNames[i]]}/${this.itemMaxCount}`
        );
      }
    };
  }

  update(time, delta) {
    if (!this.player) return;
    const speed = 200;
    this.player.setVelocity(0);

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

    // ===== Gorilla AI =====
    if (this.gorilla) {
      this.gorilla.y +=
        this.gorillaSpeed * this.gorillaDirection * (delta / 1000);
      const mapHeight = this.physics.world.bounds.height;
      if (this.gorilla.y >= mapHeight - this.gorilla.height / 2)
        this.gorillaDirection = -1;
      if (this.gorilla.y <= this.gorilla.height / 2) this.gorillaDirection = 1;
    }

    // ===== Monkey AI =====
    if (this.monkey) {
      this.monkey.y += this.monkeySpeed * this.monkeyDirection * (delta / 1000);
      if (this.monkey.y >= this.monkey.maxY) this.monkeyDirection = -1;
      if (this.monkey.y <= this.monkey.minY) this.monkeyDirection = 1;
    }

    // ===== Transition to Room2 =====
    if (
      this.player.x > 1629 &&
      this.player.x < 1643 &&
      this.player.y > 653 &&
      this.player.y < 743
    ) {
      console.log("Going to Room2");
      this.scene.start("room2", {
        playerX: 100,
        playerY: 100,
        health: this.lives,
        axe: this.axe,
        hammer: this.hammer,
        medkit: this.medkit,
        itemCounts: this.itemCounts,
      });
    }
  }
}
