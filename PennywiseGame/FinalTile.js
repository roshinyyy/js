 class FinalTile extends Phaser.Scene {
    constructor() {
      super({ key: 'FinalTile' });
      this.player = null;
      this.cursors = null;
    }
  
    preload() {
      // Load assets for FinalMap
      this.load.tilemapTiledJSON('FinalMap', 'assets/FinalTile.tmj');


      this.load.image('pipoyaimg', 'assets/pipoya.png');
      this.load.image('tileset1img', 'assets/tileset1.png');
      this.load.image('tileset2img', 'assets/tileset2.png');
      this.load.image('tileset3img', 'assets/tileset3.png');
      this.load.image('tileset4img', 'assets/tileset4.png');
      
      // Load the player spritesheet
      this.load.spritesheet('Clown', 'assets/Clown.png', 
        { frameWidth:64, frameHeight:64 });
    }
  
    create() {
      // Create the tilemap
      const map = this.make.tilemap({ key: "FinalMap" });
      const pipoya = map.addTilesetImage('pipoya', 'pipoyaimg');
      const tileset1 = map.addTilesetImage('tileset1', 'tileset1img');
      const tileset2 = map.addTilesetImage('tileset2', 'tileset2img');
      const tileset3 = map.addTilesetImage('tileset3', 'tileset3img');
      const tileset4 = map.addTilesetImage('tileset4', 'tileset4img');
      
      const tilesArray = [tileset1, pipoya, tileset2, tileset3, tileset4];
  
      // Create layers (adjust names to your Tiled file)

      map.createLayer('originalfloor', tilesArray, 0, 0);
      map.createLayer('object', tilesArray, 0, 0);
      

    // Create the player at a starting position
    this.player = this.physics.add.sprite(150, 570, 'Clown');
    window.player = this.player; // Debugging


    // Enable debugging
    window.player = this.player;

    this.player.setCollideWorldBounds(true); // don't go out of the this.map


    
    // Create player animations
    this.anims.create({
        key: 'Clown-left',
        frames: this.anims.generateFrameNumbers('Clown', { start: 118, end: 125 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'Clown-up',
        frames: this.anims.generateFrameNumbers('Clown', { start: 105, end: 112 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'Clown-down',
        frames: this.anims.generateFrameNumbers('Clown', { start: 105, end: 112 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'Clown-right',
        frames: this.anims.generateFrameNumbers('Clown', { start: 131, end: 138 }),
        frameRate: 5,
        repeat: -1
    });



    // Ensure the player stays within the world bounds
    



    // Debug: log player coordinates
    console.log(`Player: x=${this.player.x}, y=${this.player.y}`);

    // Setup keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Camera follows the player
    this.cameras.main.startFollow(this.player);
  }

  update() {
    const speed = 200;
    this.player.setVelocity(0);

    // Movement handling
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play('player-left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play('player-right', true);
    }
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play('player-up', true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play('player-down', true);
    }
    if (
      !this.cursors.left.isDown &&
      !this.cursors.right.isDown &&
      !this.cursors.up.isDown &&
      !this.cursors.down.isDown
    ) {
      this.player.anims.stop();
    }

// Debug: log player's coordinates
console.log(`Player in EnterenceTile: x=${this.player.x}, y=${this.player.y}`);

// Bounding box check to switch to SecondTile scene
// Adjust these numbers to your trigger area
  if (
    this.player.x >= 302 &&
    this.player.x <= 362 &&
    this.player.y >= 0 &&
    this.player.y <= 60
  ) {
    console.log('Switching to FinalTile scene');
    this.scene.start('FinalTile'); // Remove `{ player: this.player }`
  }
  ;
}
}