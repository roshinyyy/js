class main extends Phaser.Scene {

  constructor() {
    super({ key: "main" }); // scene key used in this.scene.start()
  }

  preload() {
    this.load.image("IntroImg", "assets/Intro.jpg");
  }

  create() {
    this.add.image(320, 320, "IntroImg").setOrigin(0.5).setScale(0.7);

    const spaceDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    spaceDown.on("down", () => {
      console.log("Go to story");
      this.scene.start("story"); // go to the next scene
    });
  }
}
