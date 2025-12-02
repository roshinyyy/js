class instruction extends Phaser.Scene {

  constructor() {
    super({ key: "instruction" });
  }

  preload() {
    this.load.image("instructionImg", "assets/instruction.jpg");
  }

  create() {
    // Display the instruction image
    this.add.image(320, 320, "instructionImg").setOrigin(0.5).setScale(0.7);

    // Space key
    const spaceDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    spaceDown.on("down", () => {
      console.log("Go to howtoplay");
      this.scene.start("howtoplay");   // ✔ GO TO HOWTOPLAY PAGE
    });
  }
}
