class SecondTile extends Phaser.Scene {
  constructor() {
      super({ key: 'SecondTile' });
      this.player = null;
      this.cursors = null;
  }

  preload() {
    // Load assets for SecondMap
      this.load.tilemapTiledJSON('SecondMap', 'assets/SecondTile.tmj');


      this.load.image("pipoyaimg", "assets/pipoya.png");
      this.load.image("tileset1img", "assets/tileset1.png");
      this.load.image("tileset3img", "assets/tileset3.png");
      
      // Load the player spritesheet
      this.load.spritesheet('Clown', 'assets/Clown.png', 
        { frameWidth:64, frameHeight:64 });
  }

  create() {
      // Create the tilemap
      const map = this.make.tilemap({ key: "SecondMap" });
      const tileset1 = map.addTilesetImage('tileset1', 'tileset1img');
      const tileset3 = map.addTilesetImage('tileset3', 'tileset3img');
      const pipoya = map.addTilesetImage('pipoya', 'pipoyaimg');
      const tilesArray = [tileset1, pipoya, tileset3];

      // Create layers
      map.createLayer('originalfloor', tilesArray, 0, 0);
      map.createLayer('object', tilesArray, 0, 0);

      // Create the player at a starting position
      this.player = this.physics.add.sprite(242, 83, 'Clown');
      window.player = this.player; // Debugging

      

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
  console.log(`Player: x=${this.player.x}, y=${this.player.y}`);

  // Bounding box check to switch to SecondTile scene
  // Adjust these numbers to your trigger area
    if (
      this.player.x >= 992 &&
      this.player.x <= 995 &&
      this.player.y >= 229 &&
      this.player.y <= 226
    ) {
      console.log('Switching to FinalTile scene');
      this.scene.start('FinalTile'); // Remove `{ player: this.player }`
    }
    ;
  }

}

