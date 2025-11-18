// --- now the game config ---
var config = {
  type: Phaser.AUTO,
  width: 32 * 20,
  height: 32 * 20,
  physics: {
    default: "arcade",
    arcade: { debug: true },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#4315a7ff",
  pixelArt: true,
  scene: [world, room1,], 
};

var game = new Phaser.Game(config);
