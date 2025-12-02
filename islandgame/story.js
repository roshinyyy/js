class StoryScene extends Phaser.Scene {
  constructor() {
    super({ key: "story" });
  }

  preload() {
    console.log("Preloading story image...");
    this.load.image("storyImg", "assets/story.png"); // make sure file name matches exactly
  }

  create() {
    console.log("Creating story scene...");
    
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Display the image
    this.add.image(320, 320, "storyImg").setOrigin(0.5).setScale(0.7);

    // Add keyboard input to move to the next scene
    const spaceDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceDown.on("down", () => {
      console.log("SPACE pressed: go to instruction scene");
      this.scene.start("instruction"); // make sure you have "instruction" scene defined
    });
  }
}
