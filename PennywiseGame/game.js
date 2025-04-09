
let config = {
  type: Phaser.AUTO,
  // pixel size * tile map size * zoom
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: false,
      debug: true,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#555555",
  pixelArt: true,
  scene: [EnterenceTile, SecondTile, FinalTile]
};

let game = new Phaser.Game(config);








