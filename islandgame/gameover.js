class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: "GameOverScene" });
    }

    preload() {
        this.load.image("gameover", "assets/gameover.jpg");
    }

    create(data) {
        const { width, height } = this.scale;

        // Check if the player collected all items (total 9)
        const totalCollected =
            (data.itemCounts?.axe || 0) +
            (data.itemCounts?.hammer || 0) +
            (data.itemCounts?.medkit || 0);

        if (totalCollected >= 9) {
            // Player collected all items, go to WinningScene
            this.scene.start("WinningScene", {
                health: data.health || 3,
                axe: data.axe || true,
                hammer: data.hammer || true,
                medkit: data.medkit || true,
                itemCounts: data.itemCounts || { axe: 3, hammer: 3, medkit: 3 },
            });
            return; // Exit this scene
        }

        // Show the regular Game Over image
        this.add.image(width / 2, height / 2, "gameover").setOrigin(0.5).setScale(0.7);

        // Optional: restart instruction
        this.add.text(width / 2, height - 200, "Press SPACE to Restart", {
            fontSize: "32px",
            fill: "#000000ff"
        }).setOrigin(0.5);

        // Restart the game on SPACE
        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("world", { health: 3 });
        });
    }
}
