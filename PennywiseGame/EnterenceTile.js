export default class EnterenceTile extends Phaser.Scene {
    constructor() {
        super({ key: "EnterenceTile" });  // ✅ FIXED: Ensure scene name matches exactly
    }

    preload() {
        // Load the tilemap and tileset
        this.load.tilemapTiledJSON("EnterenceTile", "assets/EnterenceTile.tmj"); // ✅ FIXED: Ensure correct path
        this.load.image("tilesetimg", "assets/tileset.png");
        this.load.image("pipoyaimg", "assets/pipoya.png");

        // // Load player sprite
        // this.load.spritesheet("player", "assets/player.png"), {
        // //     frameWidth: 32,
        // //     frameHeight: 32
        // // });
    }

    create() {
        // Create tilemap
        const map = this.make.tilemap({ key: "EnterenceTile" });
        const tileset1 = map.addTilesetImage("tileset1", "tileset1img");


        // const groundLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);

        // Add player
        this.player = this.physics.add.sprite(100, 100, "playerimg");

        // Enable player movement
        this.cursors = this.input.keyboard.createCursorKeys();

        // Camera follows player
        this.cameras.main.startFollow(this.player);
    }

    update() {
        // Simple player movement
        const speed = 150;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }
    }
}
