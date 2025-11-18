class gameOver extends Phaser.Scene {
  constructor() {
    super("gameOver");
  }

preload() {
  this.load.image("lostImg", "assets/lost.jpg");

}

create() {
  console.log("*** gameOver scene");
   this.scene.bringToTop("gameOver");

  // Add image and detect spacebar keypress
  this.add.image(0, 0, 'lostImg').setOrigin(0, 0);

  // Check for spacebar or any key here
  let enterDown = this.input.keyboard.addKey("ENTER");

  // On spacebar event, call the world scene
  enterDown.on("down", function () {
  console.log("Jump to world scene");
  // Reset health and items
  window.heart = 3;
  window.milk = 0;
  // window.powder = 0;
  // window.butter = 0;
  
  this.scene.start("world");
    },
    this
  );
  
  }

}