// ================= ROOM 2 SCENE =================
class room2 extends Phaser.Scene {
  constructor() {
    super({ key: "room2" });

    // Health and invulnerability
    this.maxLives = 3;
    this.lives = 3;
    this.playerHit = false;

    // Tools collected
    this.axe = false;
    this.hammer = false;
    this.medkit = false;

    // Item counts
    this.itemCounts = { axe: 0, hammer: 0, medkit: 0 };
    this.itemMaxCount = 3;
  }

  init(data) {
    this.playerX = data?.playerX || 100;
    this.playerY = data?.playerY || 100;
    this.lives = typeof data?.health === "number" ? data.health : this.lives;
    this.axe = data?.axe || this.axe;
    this.hammer = data?.hammer || this.hammer;
    this.medkit = data?.medkit || this.medkit;

    this.itemCounts = data?.itemCounts || this.itemCounts;

    this.playerHit = false;
  }

  preload() {
    this.load.tilemapTiledJSON("map3", "assets/map3.tmj");
    this.load.image("campingIMG", "assets/11_Camping_32x32.png");
    this.load.image("forestIMG", "assets/forest_tiles.png");
    this.load.image("desert1IMG", "assets/desert1.png");

    this.load.spritesheet("john", "assets/john.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("axeSheet", "assets/axe.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("hammerSheet", "assets/hammer.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("medkitSheet", "assets/medkit.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("gorilla", "assets/gorilla.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("monkey", "assets/monkey.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.image("heart", "assets/heart.png");
  }

  create() {
    console.log("*** Room2 scene started ***");

    // ===== Map =====
    this.map = this.make.tilemap({ key: "map3" });
    const tilesArray = [
      this.map.addTilesetImage("11_Camping_32x32", "campingIMG"),
      this.map.addTilesetImage("forest_tiles", "forestIMG"),
      this.map.addTilesetImage("desert1", "desert1IMG"),
    ];

    this.map.createLayer("backgroundlayer", tilesArray, 0, 0);
    this.map.createLayer("waterlayer", tilesArray, 0, 0);
    this.map.createLayer("watergrass", tilesArray, 0, 0);
    this.map.createLayer("rocklayer", tilesArray, 0, 0);
    this.map.createLayer("treelayer", tilesArray, 0, 0);
    this.map.createLayer("walkpath", tilesArray, 0, 0);

    // ===== World bounds & camera =====
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    // ===== Player spawn =====
    this.player = this.physics.add.sprite(this.playerX, this.playerY, "john");
    this.player.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.createAnimations();

    // ===== Enemies =====
    const gorillaSpawn = this.map.findObject(
      "objectLayer",
      (obj) => obj.name === "gorilla"
    );
    if (gorillaSpawn) {
      this.gorilla = this.physics.add.sprite(
        gorillaSpawn.x,
        gorillaSpawn.y,
        "gorilla"
      );
      this.gorilla.body.setSize(32, 44);
      this.gorilla.body.setOffset(16, 20);

      this.anims.create({
        key: "gorilla-walk",
        frames: this.anims.generateFrameNumbers("gorilla", {
          start: 0,
          end: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });
      this.gorilla.anims.play("gorilla-walk", true);

      this.gorillaSpeed = 100;
      this.gorillaDirection = 1;

      this.physics.add.collider(
        this.player,
        this.gorilla,
        this.handlePlayerHit,
        null,
        this
      );
    }

    const monkeySpawn = this.map.findObject(
      "objectLayer",
      (obj) => obj.name === "monkey"
    );
    if (monkeySpawn) {
      this.monkey = this.physics.add.sprite(
        monkeySpawn.x,
        monkeySpawn.y,
        "monkey"
      );
      this.monkey.body.setSize(32, 44);
      this.monkey.body.setOffset(16, 20);

      this.anims.create({
        key: "monkey-walk",
        frames: this.anims.generateFrameNumbers("monkey", { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1,
      });
      this.monkey.anims.play("monkey-walk", true);

      this.monkeySpeed = 60;
      this.monkey.minY = this.monkey.height / 2;
      this.monkey.maxY =
        this.physics.world.bounds.height - this.monkey.height / 2;
      this.monkeyDirection = 1;

      this.physics.add.collider(
        this.player,
        this.monkey,
        this.handlePlayerHit,
        null,
        this
      );
    }

    // ===== ITEMS =====
    this.items = this.physics.add.group();
    const axeObj = this.map.findObject(
      "objectLayer",
      (obj) => obj.name === "axe"
    );
    const hammerObj = this.map.findObject(
      "objectLayer",
      (obj) => obj.name === "hammer"
    );
    const medkitObj = this.map.findObject(
      "objectLayer",
      (obj) => obj.name === "medkit"
    );

    const createFloatingItem = (obj, key, scale = 1, floatHeight = 20) => {
      if (!obj) return null;

      let itemAlreadyCollected = false;
      if (
        (key === "axeSheet" && this.itemCounts.axe >= this.itemMaxCount) ||
        (key === "hammerSheet" && this.itemCounts.hammer >= this.itemMaxCount) ||
        (key === "medkitSheet" && this.itemCounts.medkit >= this.itemMaxCount)
      ) {
        itemAlreadyCollected = true;
      }
      if (itemAlreadyCollected) return null;

      let item = this.items
        .create(obj.x, obj.y, key, 0)
        .setScale(scale)
        .setOrigin(0.5);

      item.body.setSize(item.width * scale, item.height * scale);
      item.body.setAllowGravity(false);

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

    this.axeItem = createFloatingItem(axeObj, "axeSheet", 2.5, 10);
    this.hammerItem = createFloatingItem(hammerObj, "hammerSheet", 2.5, 10);
    this.medkitItem = createFloatingItem(medkitObj, "medkitSheet", 2.5, 10);

    this.physics.add.overlap(
      this.player,
      this.items,
      this.collectItem,
      null,
      this
    );

    // ===== Lives UI =====
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
        .setDisplaySize(heartSize, heartSize);
      this.livesImages.push(heart);
    }
    this.updateLivesDisplay();

    // ===== Inventory UI =====
    this.inventoryImages = [];
    this.inventoryTexts = [];

    const inventoryKeys = ["axeSheet", "hammerSheet", "medkitSheet"];
    const inventoryNames = ["axe", "hammer", "medkit"];
    const inventorySize = 40;
    const startXInv = padding;
    const startYInv = padding + 8;

    for (let i = 0; i < inventoryKeys.length; i++) {
      const img = this.add
        .image(
          startXInv + i * (inventorySize + 50),
          startYInv,
          inventoryKeys[i]
        )
        .setScrollFactor(0)
        .setDepth(9999)
        .setOrigin(0, 0)
        .setDisplaySize(inventorySize, inventorySize)
        .setTint(0xaaaaaa)
        .setAlpha(0.5);
      this.inventoryImages.push(img);

      const text = this.add
        .text(
          startXInv + i * (inventorySize + 50) + inventorySize + 5,
          startYInv + 5,
          `${this.itemCounts[inventoryNames[i]]}/${this.itemMaxCount}`,
          { fontSize: "16px", fill: "#ffffff" }
        )
        .setScrollFactor(0)
        .setDepth(9999);
      this.inventoryTexts.push(text);
    }

    this.updateInventoryUI();

    // ===== Winning Zone =====
    const winObj = this.map.findObject(
      "objectLayer",
      (obj) => obj.name === "winningZone"
    );
    if (winObj) {
      this.winningZone = this.physics.add
        .staticImage(winObj.x + winObj.width / 2, winObj.y + winObj.height / 2)
        .setVisible(false)
        .setOrigin(0.5);
      this.winningZone.body.setSize(winObj.width, winObj.height);

      this.physics.add.overlap(
        this.player,
        this.winningZone,
        () => {
          this.scene.start("WinningScene", {
            health: this.lives,
            axe: this.axe,
            hammer: this.hammer,
            medkit: this.medkit,
            itemCounts: this.itemCounts,
          });
        },
        null,
        this
      );
    }
  }

  createAnimations() {
    if (!this.anims.exists("john-left"))
      this.anims.create({
        key: "john-left",
        frames: this.anims.generateFrameNumbers("john", {
          start: 118,
          end: 125,
        }),
        frameRate: 5,
        repeat: -1,
      });
    if (!this.anims.exists("john-up"))
      this.anims.create({
        key: "john-up",
        frames: this.anims.generateFrameNumbers("john", { start: 92, end: 99 }),
        frameRate: 5,
        repeat: -1,
      });
    if (!this.anims.exists("john-down"))
      this.anims.create({
        key: "john-down",
        frames: this.anims.generateFrameNumbers("john", {
          start: 105,
          end: 112,
        }),
        frameRate: 5,
        repeat: -1,
      });
    if (!this.anims.exists("john-right"))
      this.anims.create({
        key: "john-right",
        frames: this.anims.generateFrameNumbers("john", {
          start: 131,
          end: 138,
        }),
        frameRate: 5,
        repeat: -1,
      });
  }

handlePlayerHit(player, enemy) {
    if (this.playerHit) return;

    this.lives--;
    this.updateLivesDisplay();
    this.playerHit = true;
    player.setTint(0xff0000);

    // Stop enemy movement temporarily
    if (enemy) {
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
    }

    if (this.lives <= 0) {
        this.scene.start("GameOverScene");
        return;
    }

    this.time.delayedCall(1500, () => {
        this.playerHit = false;
        player.clearTint();

        // Resume enemy movement
        if (enemy === this.gorilla) this.gorillaDirection = 1;
        if (enemy === this.monkey) this.monkeyDirection = 1;
    });
}


  collectItem(player, item) {
    if (!item) return;

    if (item === this.axeItem && this.itemCounts.axe < this.itemMaxCount) {
      this.itemCounts.axe++;
      this.axe = true;
    }
    if (
      item === this.hammerItem &&
      this.itemCounts.hammer < this.itemMaxCount
    ) {
      this.itemCounts.hammer++;
      this.hammer = true;
    }
    if (
      item === this.medkitItem &&
      this.itemCounts.medkit < this.itemMaxCount
    ) {
      this.itemCounts.medkit++;
      this.medkit = true;
      if (this.lives < this.maxLives) this.lives++;
      this.updateLivesDisplay();
    }

    item.destroy();
    this.updateInventoryUI();
  }

  updateLivesDisplay() {
    for (let i = 0; i < this.maxLives; i++) {
      if (i < this.lives) {
        this.livesImages[i].clearTint();
        this.livesImages[i].setAlpha(1);
      } else {
        this.livesImages[i].setTint(0x555555);
        this.livesImages[i].setAlpha(0.45);
      }
    }
  }

  updateInventoryUI() {
    const inventoryNames = ["axe", "hammer", "medkit"];
    const itemsCollected = [this.axe, this.hammer, this.medkit];
    for (let i = 0; i < itemsCollected.length; i++) {
      if (itemsCollected[i]) {
        this.inventoryImages[i].clearTint();
        this.inventoryImages[i].setAlpha(1);
      } else {
        this.inventoryImages[i].setTint(0xaaaaaa);
        this.inventoryImages[i].setAlpha(0.5);
      }
      this.inventoryTexts[i].setText(
        `${this.itemCounts[inventoryNames[i]]}/${this.itemMaxCount}`
      );
    }
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

    // ===== Transition to Room1 =====
    if (
      this.player.x > 322 &&
      this.player.x < 345 &&
      this.player.y > 975 &&
      this.player.y < 1085
    ) {
      this.scene.start("room1", {
        playerX: this.player.x,
        playerY: this.player.y,
        health: this.lives,
        axe: this.axe,
        hammer: this.hammer,
        medkit: this.medkit,
        itemCounts: this.itemCounts,
      });
    }

    // ===== Gorilla AI =====
    if (this.gorilla) {
      this.gorilla.y +=
        this.gorillaSpeed * this.gorillaDirection * (delta / 1000);
      if (
        this.gorilla.y >=
        this.physics.world.bounds.height - this.gorilla.height / 2
      )
        this.gorillaDirection = -1;
      if (this.gorilla.y <= this.gorilla.height / 2) this.gorillaDirection = 1;
    }

    // ===== Monkey AI =====
    if (this.monkey) {
      this.monkey.y += this.monkeySpeed * this.monkeyDirection * (delta / 1000);
      if (this.monkey.y >= this.monkey.maxY) this.monkeyDirection = -1;
      if (this.monkey.y <= this.monkey.minY) this.monkeyDirection = 1;
    }
  }
}
