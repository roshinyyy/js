
const config = {
  type: Phaser.AUTO,
  width: 640, 
  height: 640, 
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#555555',
  pixelArt: true,
  scene: [EnterenceTile, SecondTile, FinalTile]
};

new Phaser.Game(config);

