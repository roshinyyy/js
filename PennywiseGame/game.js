import EnterenceTile from "./EnterenceTile.js";

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: "Game" });
    }

    create() {
        this.scene.start("EnterenceTile");  // ✅ FIXED: Ensure correct scene name
    }
}
