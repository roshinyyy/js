 class SecondTile extends Phaser.Scene {
    constructor() {
      super({ key: 'SecondTile' });
      this.player = null;
      this.cursors = null;
    }
  
    preload() {
      // Load assets for EnterenceTile
      this.load.tilemapTiledJSON('SecondMap', 'assets/SecondTile.tmj');
      this.load.image("pipoyaimg", "assets/pipoya.png");
      this.load.image("tileset1img", "assets/tileset1.png");
      this.load.image("tileset3img", "assets/tileset3.png");
      
    //   // Load the player spritesheet
    //   this.load.spritesheet('player', 'assets/player.png', { frameWidth: 64, frameHeight: 64 });
    }
  
    create() {
      // Create the tilemap
      const map = this.make.tilemap({ key: "SecondMap" });
  
      const tileset1 = map.addTilesetImage('tileset1', 'tileset1img');
      const tileset3 = map.addTilesetImage('tileset3', 'tileset3img');
      const pipoya = map.addTilesetImage('pipoya', 'pipoyaimg');
      const tilesArray = [tileset1, pipoya,tileset3];
  
      // Create layers (adjust names to your Tiled file)
      map.createLayer('originalfloor', tilesArray, 0, 0);
      map.createLayer('object', tilesArray, 0, 0);
      
      // Create the player at a starting position (you can adjust these coordinates)
      this.player = this.physics.add.sprite(150, 570, 'player');
      window.player = this.player; // For debugging
  
      // Ensure the player stays within the world bounds
      this.player.setCollideWorldBounds(true);
  
      // Create basic player animations
      this.anims.create({
        key: 'player-left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
        frameRate: 5,
        repeat: -1
      });
      this.anims.create({
        key: 'player-up',
        frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
        frameRate: 5,
        repeat: -1
      });
      this.anims.create({
        key: 'player-down',
        frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
        frameRate: 5,
        repeat: -1
      });
      this.anims.create({
        key: 'player-right',
        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
        frameRate: 5,
        repeat: -1
      });
  
      // Setup keyboard input
      this.cursors = this.input.keyboard.createCursorKeys();
  
      // Camera follows the player
      this.cameras.main.startFollow(this.player);
    }
  
    update() {
      const speed = 200;
      this.player.setVelocity(0);
  
      // Movement handling with optimized animations
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-speed);
        this.player.anims.play('player-left', true);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(speed);
        this.player.anims.play('player-right', true);
      } else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-speed);
        this.player.anims.play('player-up', true);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(speed);
        this.player.anims.play('player-down', true);
      } else {
        this.player.anims.stop();
      }
  
      // Debug: log player's coordinates
      console.log(`Player in EnterenceTile: x=${this.player.x}, y=${this.player.y}`);
  
      // Bounding box check to switch to SecondTile scene
      if (
        this.player.x >= 32 &&
        this.player.x <= 35 &&
        this.player.y >= 165 &&
        this.player.y <= 180
      ) {
        console.log('Switching to SecondTile');
        this.scene.start('SecondTile', { player: this.player });
      }
    }
    } 
  