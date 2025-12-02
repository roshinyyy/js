class world extends Phaser.Scene {
    constructor() {
        super({ key: "world" });

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
        this.lives = typeof data?.health === "number" ? data.health : this.lives;
        this.axe = data?.axe || this.axe;
        this.hammer = data?.hammer || this.hammer;
        this.medkit = data?.medkit || this.medkit;

        // ⭐ persist collected item numbers ⭐
        this.itemCounts = data?.itemCounts || this.itemCounts;

        this.playerHit = false;
        console.log("world scene initialized with lives:", this.lives);
    }

    preload() {
        // ===== Map and Tiles =====
        this.load.tilemapTiledJSON("map", "assets/map.tmj");
        this.load.image("campingIMG", "assets/11_Camping_32x32.png");
        this.load.image("forestIMG", "assets/forest_tiles.png");
        this.load.image("plantIMG", "assets/plant.png");
        this.load.image("trees-greenIMG", "assets/trees-green.png");
        this.load.image("desert2IMG", "assets/desert2.png");

        // ===== Player =====
        this.load.spritesheet("john", "assets/john.png", { frameWidth: 64, frameHeight: 64 });

        // ===== Enemies =====
        this.load.spritesheet("gorilla", "assets/gorilla.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("monkey", "assets/monkey.png", { frameWidth: 64, frameHeight: 64 });

        // ===== Items =====
        this.load.spritesheet("axeSheet", "assets/axe.png", { frameWidth: 32, frameHeight: 26 });
        this.load.spritesheet("hammerSheet", "assets/hammer.png", { frameWidth: 32, frameHeight: 26 });
        this.load.spritesheet("medkitSheet", "assets/medkit.png", { frameWidth: 32, frameHeight: 26 });

        // ===== Heart image =====
        this.load.image("heart", "assets/heart.png");
    }

    create() {
        console.log("* world scene *");

        // ===== Map =====
        const map = this.make.tilemap({ key: "map" });
        const tilesArray = [
            map.addTilesetImage("11_Camping_32x32", "campingIMG"),
            map.addTilesetImage("forest_tiles", "forestIMG"),
            map.addTilesetImage("plant", "plantIMG"),
            map.addTilesetImage("trees-green", "trees-greenIMG"),
            map.addTilesetImage("desert2", "desert2IMG"),
        ];

        this.groundlayer = map.createLayer("backgroundlayer", tilesArray, 0, 0);
        this.platformlayer = map.createLayer("waterlayer", tilesArray, 0, 0);
        this.uplayer = map.createLayer("grasslayer", tilesArray, 0, 0);
        this.bigtree = map.createLayer("bigtree", tilesArray, 0, 0);
        this.bigtree1 = map.createLayer("bigtree1", tilesArray, 0, 0);
        this.bigtree2 = map.createLayer("bigtree2", tilesArray, 0, 0);

        // Start object
        const start = map.findObject("objectLayer", (obj) => obj.name === "start");
        if (!start) {
            console.error("Start object not found in the map.");
            return;
        }

        this.player = this.physics.add.sprite(start.x, start.y, "john");
        this.player.body.setSize(32, 16);
        this.player.body.setOffset(16, 48);
        this.player.setCollideWorldBounds(true);

        const obstacleLayers = [
            this.groundlayer,
            this.platformlayer,
            this.uplayer,
            this.bigtree,
            this.bigtree1,
            this.bigtree2
        ];
        obstacleLayers.forEach(layer => {
            if (layer) {
                layer.setCollisionByExclusion([-1], true);
                this.physics.add.collider(this.player, layer);
            }
        });

        // ===== Player Animations =====
        this.anims.create({ key: "john-up", frames: this.anims.generateFrameNumbers("john", { start: 105, end: 112 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: "john-left", frames: this.anims.generateFrameNumbers("john", { start: 118, end: 125 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: "john-down", frames: this.anims.generateFrameNumbers("john", { start: 131, end: 138 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: "john-right", frames: this.anims.generateFrameNumbers("john", { start: 144, end: 151 }), frameRate: 5, repeat: -1 });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player);
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        // ===== Gorilla =====
        const gorillaSpawn = map.findObject("objectLayer", (obj) => obj.name === "gorilla");
        if (gorillaSpawn) {
            this.gorilla = this.physics.add.sprite(gorillaSpawn.x, gorillaSpawn.y, "gorilla");
            this.gorilla.body.setSize(32, 44);
            this.gorilla.body.setOffset(16, 20);
            this.gorilla.body.immovable = true;

            this.anims.create({ key: "gorilla-walk", frames: this.anims.generateFrameNumbers("gorilla", { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
            this.gorilla.anims.play("gorilla-walk", true);

            this.gorillaSpeed = 100;
            this.gorillaDirection = 1;

            this.physics.add.collider(this.player, this.gorilla, this.handlePlayerHit, null, this);
        }

        // ===== Monkey =====
        const monkeySpawn = map.findObject("objectLayer", (obj) => obj.name === "monkey");
        if (monkeySpawn) {
            this.monkey = this.physics.add.sprite(monkeySpawn.x, monkeySpawn.y, "monkey");
            this.monkey.body.setSize(32, 44);
            this.monkey.body.setOffset(16, 20);
            this.monkey.body.immovable = true;

            this.anims.create({ key: "monkey-walk", frames: this.anims.generateFrameNumbers("monkey", { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
            this.monkey.anims.play("monkey-walk", true);

            this.monkeySpeed = 60;
            this.monkey.minY = monkeySpawn.y - 50;
            this.monkey.maxY = monkeySpawn.y + 50;
            this.monkeyDirection = 1;

            this.physics.add.collider(this.player, this.monkey, this.handlePlayerHit, null, this);
        }

        // ===== Items =====
        this.items = this.physics.add.group();
        const axeObj = map.findObject("objectLayer", (obj) => obj.name === "axe");
        const hammerObj = map.findObject("objectLayer", (obj) => obj.name === "hammer");
        const medkitObj = map.findObject("objectLayer", (obj) => obj.name === "medkit");

        const createFloatingItem = (obj, key, scale = 1, floatHeight = 20, frame = 0) => {
            if (!obj) return null;

            // Only create item if not already collected
            let itemAlreadyCollected = false;
            if ((key === "axeSheet" && this.itemCounts.axe > 0) ||
                (key === "hammerSheet" && this.itemCounts.hammer > 0) ||
                (key === "medkitSheet" && this.itemCounts.medkit > 0)) {
                itemAlreadyCollected = true;
            }
            if (itemAlreadyCollected) return null;

            let item = this.items.create(obj.x, obj.y, key, frame)
                .setScale(scale)
                .setOrigin(0.5, 1)
                .setDepth(10);
            item.body.setSize(item.width * scale, item.height * scale);
            this.tweens.add({
                targets: item,
                y: item.y - floatHeight,
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut"
            });
            return item;
        };

        this.axeItem = createFloatingItem(axeObj, "axeSheet", 2.5, 10);
        this.hammerItem = createFloatingItem(hammerObj, "hammerSheet", 2.5, 20);
        this.medkitItem = createFloatingItem(medkitObj, "medkitSheet", 2.5, 10);

        this.physics.add.overlap(this.player, this.items, this.collectItem, null, this);

        // ===== Lives UI =====
        this.livesImages = [];
        const padding = 8;
        const heartSize = 40;
        const startX = this.scale.width - padding - heartSize;
        const startY = padding + 8;

        for (let i = 0; i < this.maxLives; i++) {
            const heart = this.add.image(startX - i * (heartSize + 6), startY, "heart")
                .setScrollFactor(0)
                .setDepth(9999)
                .setOrigin(0, 0)
                .setDisplaySize(heartSize, heartSize);
            this.livesImages.push(heart);
        }

        this.updateLivesDisplay = () => {
            for (let i = 0; i < this.maxLives; i++) {
                const img = this.livesImages[i];
                if (i < this.lives) { img.clearTint(); img.setAlpha(1); }
                else { img.setTint(0x555555); img.setAlpha(0.45); }
            }
        };
        this.updateLivesDisplay();

        // ===== Inventory UI with counters =====
        this.inventoryImages = [];
        this.inventoryTexts = [];

        const inventoryKeys = ["axeSheet", "hammerSheet", "medkitSheet"];
        const inventoryNames = ["axe", "hammer", "medkit"];
        const inventorySize = 40;
        const startXInv = padding;
        const startYInv = padding + 8;

        for (let i = 0; i < inventoryKeys.length; i++) {
            const img = this.add.image(startXInv + i * (inventorySize + 50), startYInv, inventoryKeys[i])
                .setScrollFactor(0)
                .setDepth(9999)
                .setOrigin(0, 0)
                .setDisplaySize(inventorySize, inventorySize)
                .setTint(0xaaaaaa)
                .setAlpha(0.5);
            this.inventoryImages.push(img);

            const text = this.add.text(startXInv + i * (inventorySize + 50) + inventorySize + 5, startYInv + 5,
                `${this.itemCounts[inventoryNames[i]]}/${this.itemMaxCount}`, { fontSize: '16px', fill: '#ffffff' })
                .setScrollFactor(0)
                .setDepth(9999);
            this.inventoryTexts.push(text);
        }

        this.updateInventoryUI = () => {
            const itemsCollected = [this.axe, this.hammer, this.medkit];
            for (let i = 0; i < itemsCollected.length; i++) {
                if (itemsCollected[i]) { this.inventoryImages[i].clearTint(); this.inventoryImages[i].setAlpha(1); }
                else { this.inventoryImages[i].setTint(0xaaaaaa); this.inventoryImages[i].setAlpha(0.5); }
                this.inventoryTexts[i].setText(`${this.itemCounts[inventoryNames[i]]}/${this.itemMaxCount}`);
            }
        };
        this.updateInventoryUI();
    }

    handlePlayerHit(player, enemy) {
        if (this.playerHit) return;
        this.lives--;
        this.updateLivesDisplay();
        this.playerHit = true;
        player.setTint(0xff0000);

        if (this.lives <= 0) {
            this.scene.start("GameOverScene");
            return;
        }

        this.time.delayedCall(1500, () => {
            this.playerHit = false;
            player.clearTint();
        });
    }

    collectItem(player, item) {
        if (!item) return;

        if (item === this.axeItem && this.itemCounts.axe < this.itemMaxCount) {
            this.itemCounts.axe++;
            this.axe = true;
        }
        if (item === this.hammerItem && this.itemCounts.hammer < this.itemMaxCount) {
            this.itemCounts.hammer++;
            this.hammer = true;
        }
        if (item === this.medkitItem && this.itemCounts.medkit < this.itemMaxCount) {
            this.itemCounts.medkit++;
            this.medkit = true;
            if (this.lives < this.maxLives) this.lives++;
            this.updateLivesDisplay();
        }

        item.destroy();
        this.updateInventoryUI();
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

        // ===== Transition to room1 with collected itemCounts ⭐
        if (this.player.x >= 840 && this.player.x <= 880 && this.player.y <= 250) {
            this.scene.start("room1", {
                health: this.lives,
                axe: this.axe,
                hammer: this.hammer,
                medkit: this.medkit,
                playerX: 840,
                playerY: 250,
                itemCounts: this.itemCounts
            });
        }

        // ===== Gorilla AI =====
        if (this.gorilla) {
            this.gorilla.y += this.gorillaSpeed * this.gorillaDirection * (delta / 1000);
            const mapHeight = this.physics.world.bounds.height;
            if (this.gorilla.y >= mapHeight - this.gorilla.height / 2) this.gorillaDirection = -1;
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
