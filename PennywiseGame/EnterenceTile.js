class EnterenceTile extends Phaser.Scene {
  constructor() {
    super({ key: 'EnterenceTile' });
    this.player = null;
    this.cursors = null;
  }

  preload() {
    // Load assets for EnterenceTile
    this.load.tilemapTiledJSON('EnterenceMap', 'assets/EnterenceTile.tmj');
    this.load.image("pipoyaimg", "assets/pipoya.png");
    this.load.image("tileset1img", "assets/tileset1.png");
    
//   // Load the player spritesheet
this.load.spritesheet('Clown', 'assets/Clown.png',
{ frameWidth:64, frameHeight:64 });

}
 create() {
    // Create the tilemap
    const map = this.make.tilemap({ key: "EnterenceMap" });
    const tileset1 = map.addTilesetImage('tileset1', 'tileset1img');
    const pipoya = map.addTilesetImage('pipoya', 'pipoyaimg');
    const tilesArray = [tileset1, pipoya];

    // Create layers (adjust names to your Tiled file)
    map.createLayer('originalfloor', tilesArray, 0, 0);
    map.createLayer('object', tilesArray, 0, 0);
    


    // Create the player at a starting position (you can adjust these coordinates)
    this.player = this.physics.add.sprite(579,910, 'Clown');
    window.player = this.player; // For debugging

    // Create basic player animations
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
      frames: this.anims.generateFrameNumbers('Clown', { start: 131, end: 138 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'Clown-right',
      frames: this.anims.generateFrameNumbers('Clown', { start: 144, end: 151 }),
      frameRate: 5,
      repeat: -1
    });


    // Ensure the player stays within the world bounds
    



    // Debug: log player coordinates
    console.log(`Player:EnterenceTile x=${this.player.x}, y=${this.player.y}`);

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
    console.log('Switching to SecondTile scene');
    this.scene.start('SecondTile'); // Remove `{ player: this.player }`
  }
  ;
}
}


