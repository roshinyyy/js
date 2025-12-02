class howtoplay extends Phaser.Scene {

  constructor() {
    super({ key: "howtoplay" });
  }

  preload() {
    this.load.image("howtoplayImg", "assets/howtoplay.jpg");
  }

  create() {
    this.add.image(320, 320, "howtoplayImg").setOrigin(0.5).setScale(0.7);

    const spaceDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    spaceDown.on("down", () => {
      console.log("Go to world");
      this.scene.start("world");
    });
  }
}
