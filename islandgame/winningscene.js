class WinningScene extends Phaser.Scene {
  constructor() {
    super({ key: "WinningScene" });
  }

  preload() {
    this.load.image("promotionImg", "assets/promotion.png");
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.add.image(320,320, "promotionImg").setOrigin(0.5).setScale(0.7);

    

    this.input.once('pointerdown', () => {
      this.scene.start("room1"); // restart game or go wherever
    });
  }
}
