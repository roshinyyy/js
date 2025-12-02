// --- Game config ---
var config = {
  type: Phaser.AUTO,
  width: 32 * 20,
  height: 32 * 20,
  physics: {
    default: "arcade",
    arcade: { debug: false  },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#4315a7ff",
  pixelArt: true,

  // Correctly reference class names
  scene: [main, StoryScene, instruction, howtoplay, world, room1, room2, WinningScene, GameOverScene],
};

// Create the game
var game = new Phaser.Game(config);

// Global variables
window.heart = 3;
window.axe = 0;
window.medkit = 0;
window.hammer = 0;