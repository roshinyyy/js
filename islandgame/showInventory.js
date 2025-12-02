class showInventory extends Phaser.Scene {
  constructor() {
    super({ key: "showInventory", active: false });
  }

  init(data) {
    this.player = data.player;
    this.inventory = data.inventory;
  }

  preload() {
    // Load images
    this.load.image("heart", "assets/heart.png");
    this.load.image("hammer", "assets/collectMilk.png");
    this.load.image("axe", "assets/collectEgg.png");
    this.load.image("medkit", "assets/collectPowder.png");
  }

  create() {
    console.log("***showInventory");
    this.scene.bringToTop("showInventory");

    // Black bar background
    const rect = new Phaser.Geom.Rectangle(29, 10, 500, 80);
    const graphics = this.add.graphics({ fillStyle: { color: 0xffffff } });
    graphics.fillRectShape(rect).setScrollFactor(0);

    // Hearts
    this.heartimg1 = this.add.image(70, 48, "heart").setScrollFactor(0).setVisible(true).setScale(0.2);
    this.heartimg2 = this.add.image(120, 48, "heart").setScrollFactor(0).setVisible(true).setScale(0.2);
    this.heartimg3 = this.add.image(170, 48, "heart").setScrollFactor(0).setVisible(true).setScale(0.2);

    // Items
    this.axe = this.add.image(235, 50, "axe").setScrollFactor(0).setVisible(true).setScale(1);
    this.hammer = this.add.image(295, 48, "hammer").setScrollFactor(0).setVisible(true).setScale(1.2);
    this.medkit = this.add.image(352, 50, "medkit").setScrollFactor(0).setVisible(true).setScale(0.8);

    // Item counts text
    this.axeNum = this.add.text(250, 30, window.milk || 0, { font: "30px Futura PT Medium", fill: "#272e66" }).setScrollFactor(0);
    this.hammerNum = this.add.text(310, 30, window.milk || 0, { font: "30px Futura PT Medium", fill: "#272e66" }).setScrollFactor(0);
    this.medkitNum = this.add.text(370, 30, window.milk || 0, { font: "30px Futura PT Medium", fill: "#272e66" }).setScrollFactor(0);

    // Event listener
    this.events.on("inventory", this.updateScreen, this);

    // Lives tracking
    this.lives = 3;
  }

  // Call this method to remove a heart
  loseLife() {
    if (this.lives <= 0) return;

    this.lives--;

    switch (this.lives) {
      case 2:
        this.heartimg3.setVisible(false);
        break;
      case 1:
        this.heartimg2.setVisible(false);
        break;
      case 0:
        this.heartimg1.setVisible(false);
        console.log("*** Game Over!");
        // Optionally: this.scene.start("gameover");
        break;
    }
  }

  updateScreen(data) {
    console.log("Received event inventory", data);

    if (this.axeNum) this.axeNum.setText(data.milk || 0);
    if (this.hammerNum) this.hammerNum.setText(data.egg || 0);
    if (this.medkitNum) this.medkitNum.setText(data.powder || 0);

    if (data.heart !== undefined) {
      switch (data.heart) {
        case 3:
          this.heartimg1.setVisible(true);
          this.heartimg2.setVisible(true);
          this.heartimg3.setVisible(true);
          break;
        case 2:
          this.heartimg1.setVisible(true);
          this.heartimg2.setVisible(true);
          this.heartimg3.setVisible(false);
          break;
        case 1:
          this.heartimg1.setVisible(true);
          this.heartimg2.setVisible(false);
          this.heartimg3.setVisible(false);
          break;
        case 0:
          this.heartimg1.setVisible(false);
          this.heartimg2.setVisible(false);
          this.heartimg3.setVisible(false);
          break;
        default:
          break;
      }
    }
  }
}
