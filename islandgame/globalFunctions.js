// /////////////////////////////////////////////////////////////////////////////
// // ================= PHASER GAME SCENE TEMPLATE =================
// // Use this template for any game world or level scene.
// /////////////////////////////////////////////////////////////////////////////
// class TemplateScene extends Phaser.Scene {
//   constructor() {
//     super({ key: "world" });

//     // --- Core Scene State Variables ---
//     this.playerHit = false; // Invincibility flag (set to true after hit)
//     this.invincibleDuration = 1000; // 1 second invincibility
//   }

//   // Initialize state, often used to pass data (like health/inventory) between scenes
//   init(data) {
//     // Use incoming data or set defaults
//     this.inventory = data?.inventory ?? [];
//     this.health = data?.health ?? 3;
//     this.score = data?.score ?? 0;
//     console.log("world scene initialized with health:", this.health);
//   }

//   preload() {
//     // =================================================================
//     // 1. ASSET LOADING SECTION
//     // Replace the placeholder asset keys and file paths with your own game assets.
//     // =================================================================

//     // --- Map and Tiles ---
//     this.load.tilemapTiledJSON("map1", "assets/map.tmj");
//     this.load.image("campingIMG", "assets/11_Camping_32x32.png");
//     this.load.image("forestIMG", "assets/forest_tiles.png");
//     this.load.image("plantIMG", "assets/plant.png");
//     this.load.image("trees-greenIMG", "assets/trees-green.png");
//     this.load.image("desert2IMG", "assets/desert2.png");

//     // --- Player Character ---
//     // ===== Player =====
//     this.load.spritesheet("john", "assets/john.png", {
//       frameWidth: 64,
//       frameHeight: 64,
//     });

//     // ===== Gorilla Enemy =====
//     this.load.spritesheet("gorilla", "assets/gorilla.png", {
//       frameWidth: 64,
//       frameHeight: 64,
//     });

//     // ===== Monkey Enemy =====
//     this.load.spritesheet("monkey", "assets/monkey.png", {
//       frameWidth: 64,
//       frameHeight: 64,
//     });

//     // ===== Collectables (Tools and Medkit) =====
//     this.load.spritesheet("axeSheet", "assets/axe.png", {
//       frameWidth: 32,
//       frameHeight: 26,
//     });
//     this.load.spritesheet("hammerSheet", "assets/hammer.png", {
//       frameWidth: 32,
//       frameHeight: 26,
//     });
//     this.load.spritesheet("medkitSheet", "assets/medkit.png", {
//       frameWidth: 32,
//       frameHeight: 26,
//     });

//     // 💖 ===== HUD: Heart Image =====
//     this.load.image("heart", "assets/heart.png");
//   }

//   //     // --- Audio ---
//   //     this.load.audio("collect_snd", "assets/collect.mp3");
//   //     // this.load.audio("bgmusic_snd", "assets/bgmusic.mp3");
//   // }

//   create() {
//     console.log("* world scene *");

//     // Reset state
//     this.invincible = false;

//     // Sound effects
//     this.collectSnd = this.sound.add("collect_snd");
//     // this.mainSnd = this.sound.add("bgmusic_snd", { loop: true, volume: 0.3 });
//     // this.mainSnd.play();

//     // =================================================================
//     // 2. MAP SETUP AND COLLISION
//     // Change "map_key" and layer names to match your Tiled JSON file.
//     // =================================================================
//     const map = this.make.tilemap({ key: "map1" });

//     // List all your tileset images here, matching the Tiled names to the Phaser keys
//     const tilesArray = [
//       map.addTilesetImage("11_Camping_32x32", "campingIMG"),
//       map.addTilesetImage("forest_tiles", "forestIMG"),
//       map.addTilesetImage("plant", "plantIMG"),
//       map.addTilesetImage("trees-green", "trees-greenIMG"),
//       map.addTilesetImage("desert2", "desert2IMG"),
//     ];

//     // Create layers based on your Tiled map layer names
//     this.groundlayer = map.createLayer("backgroundlayer", tilesArray, 0, 0);
//     this.platformlayer = map.createLayer("waterlayer", tilesArray, 0, 0);
//     this.uplayer = map.createLayer("grasslayer", tilesArray, 0, 0);

//     // Set collision properties on the layers
//     this.groundlayer.setCollisionByExclusion(-1, true);
//     this.platformlayer.setCollisionByExclusion(-1, true);
//     this.uplayer.setCollisionByExclusion(-1, true);

//     // =================================================================
//     // 3. ANIMATION DEFINITIONS
//     // Adjust frame numbers and frame rates for your character/enemies.
//     // =================================================================

//     // ===== Player Animations =====
//     this.anims.create({
//       key: "john-up",
//       frames: this.anims.generateFrameNumbers("john", { start: 105, end: 112 }),
//       frameRate: 5,
//       repeat: -1,
//     });
//     this.anims.create({
//       key: "john-left",
//       frames: this.anims.generateFrameNumbers("john", { start: 118, end: 125 }),
//       frameRate: 5,
//       repeat: -1,
//     });
//     this.anims.create({
//       key: "john-down",
//       frames: this.anims.generateFrameNumbers("john", { start: 131, end: 138 }),
//       frameRate: 5,
//       repeat: -1,
//     });
//     this.anims.create({
//       key: "john-right",
//       frames: this.anims.generateFrameNumbers("john", { start: 144, end: 151 }),
//       frameRate: 5,
//       repeat: -1,
//     });

//     // ... define other enemy animations

//     // =================================================================
//     // 4. PLAYER AND ENEMY SETUP
//     // Use object names from your Tiled map's object layer to spawn things.
//     // =================================================================

//     // Find starting position from Tiled map (optional, but good practice)
//     // const startPos = map.findObject("objectLayer", (obj) => obj.name === "start_position");
//     // this.player = this.physics.add.sprite(startPos.x, startPos.y, "player_key").setScale(1).play("player-down");

//     // Player Setup (using a fixed position for simplicity if Tiled start object is not used)
//     this.player = this.physics.add
//       .sprite(400, 400, "player_key")
//       .setScale(1)
//       .play("player-down");
//     this.player.setCollideWorldBounds(true);
//     // Important: Adjust the player's collision body size if the sprite sheet has padding
//     this.player.body.setSize(this.player.width * 0.7, this.player.height * 0.7);

//     // Enemy 1 (Patrol)
//     const enemy1Spawn = map.findObject(
//       "objectLayer",
//       (obj) => obj.name === "enemy1_spawn"
//     );
//     this.enemy1 = this.physics.add
//       .sprite(enemy1Spawn?.x ?? 200, enemy1Spawn?.y ?? 750, "enemy1_key")
//       .setScale(0.5)
//       .setFrame(1);
//     this.enemy1.body.setSize(80, 150); // Adjust size/offset for precise collision
//     this.enemy1.body.setOffset(30, 65);
//     this.enemy1.setImmovable(true); // Enemies shouldn't be pushed back

//     // Example: Enemy patrol tween
//     this.enemy1Tween = this.tweens.add({
//       targets: this.enemy1,
//       x: (enemy1Spawn?.x ?? 200) + 170, // Adjust patrol distance
//       yoyo: true,
//       repeat: -1,
//       duration: 1800,
//       ease: "Sine.easeInOut",
//       onUpdate: (tween, target) => {
//         // Logic to flip/change frame based on movement direction
//         let prevX = target.prevX ?? target.x;
//         if (target.x > prevX) {
//           target.setFrame(1);
//         } else if (target.x < prevX) {
//           target.setFrame(0);
//         }
//         target.prevX = target.x;
//       },
//     });

//     // =================================================================
//     // 5. COLLECTABLES SETUP
//     // Spawn multiple collectable items and add them to a group.
//     // =================================================================
//     this.collectablesGroup = this.physics.add.staticGroup();

//     const collectableSpawns = [
//       map.findObject("objectLayer", (obj) => obj.name === "collectable_pos1"),
//       map.findObject("objectLayer", (obj) => obj.name === "collectable_pos2"),
//       // Add more spawn points here
//     ];

//     collectableSpawns.forEach((spawn) => {
//       if (spawn) {
//         this.collectablesGroup
//           .create(spawn.x, spawn.y, "collectable1_key")
//           .setScale(2);
//         // Optional: add animation or floating tween to collectables here
//       }
//     });

//     // =================================================================
//     // 6. PHYSICS: COLLISION & OVERLAPS (MUST BE LAST)
//     // =================================================================

//     // Player/Map Collision
//     this.physics.add.collider(this.player, this.collisionLayer1);
//     this.physics.add.collider(this.player, this.collisionLayer2);

//     // Player/Collectable Overlap (triggers the item collection function)
//     this.physics.add.overlap(
//       this.player,
//       this.collectablesGroup,
//       this.collectItem,
//       null,
//       this
//     );

//     // Player/Enemy Overlap (triggers the player hit function)
//     this.physics.add.overlap(
//       this.player,
//       [this.enemy1, this.enemy2], // Add all your enemies here
//       this.playerHit,
//       null,
//       this
//     );

//     // =================================================================
//     // 7. CAMERA, CONTROLS, and HUD
//     // =================================================================
//     this.cursors = this.input.keyboard.createCursorKeys();

//     // Camera setup
//     this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
//     this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
//     this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
//     this.cameras.main.setZoom(1.0);

//     // HUD: Score Text
//     this.scoreText = this.add
//       .text(640, 38, "Score: 0", {
//         fontSize: "24px",
//         fill: "#000000ff",
//         fontFamily: "Arial",
//       })
//       .setScrollFactor(0) // Crucial: Locks to viewport
//       .setDepth(9999);

//     // HUD: Health Hearts Group (calls a function to draw hearts)
//     this.hearts = this.add.group();
//     this.updateHearts();
//   }

//   /////////////////////////////////////////////////////////////////////////////
//   // =========================== GAME LOGIC FUNCTIONS ===========================
//   /////////////////////////////////////////////////////////////////////////////

//   // Function to handle player collecting an item
//   collectItem(player, item) {
//     item.disableBody(true, true); // Hide and disable the item
//     this.collectSnd.play();
//     this.score++;
//     this.scoreText.setText("Score: " + this.score);

//     // Add specific inventory logic here if needed
//   }

//   // Function to handle player being hit by an enemy
//   playerHit(player, enemy) {
//     if (this.invincible) return; // Ignore hit if currently invincible

//     this.health--;
//     this.updateHearts(); // Update the visual health display

//     // Check for Game Over condition
//     if (this.health <= 0) {
//       this.scene.start("GameOverSceneKey"); // Change to your game over scene key
//       return;
//     }

//     // Apply invincibility and visual feedback
//     this.invincible = true;
//     player.setAlpha(0.5); // Visual flash/alpha change
//     player.setVelocity(0, 0); // Stop movement immediately after hit

//     // Remove invincibility and reset visual state after duration
//     this.time.delayedCall(this.invincibleDuration, () => {
//       this.invincible = false;
//       player.setAlpha(1);
//     });
//   }

//   // Function to redraw the health bar
//   updateHearts() {
//     this.hearts.clear(true, true);

//     // Position the hearts (adjust start position '50' and spacing '40' as needed)
//     for (let i = 0; i < this.health; i++) {
//       this.add
//         .image(50 + i * 40, 50, "heart_key") // Change "heart_key" to your loaded heart key
//         .setScrollFactor(0)
//         .setScale(0.1) // Adjust scale to match your asset size
//         .setDepth(9999);
//     }
//   }

//   // Function to transition to a new level/scene
//   goToNextLevel() {
//     console.log("Jumping to next level scene");
//     this.scene.start("NextLevelSceneKey", {
//       health: this.health,
//       score: this.score,
//     });
//   }

//   /////////////////////////////////////////////////////////////////////////////
//   // =============================== MAIN GAME LOOP ============================
//   /////////////////////////////////////////////////////////////////////////////

//   update() {
//     let speed = 200;

//     // Reset Speed
//     this.player.setVelocity(0, 0);

//     // Only allow movement if not invincible
//     if (!this.invincible) {
//       if (this.cursors.left.isDown) {
//         this.player.setVelocityX(-speed);
//         this.player.anims.play("player-left", true); // Change animation key
//       } else if (this.cursors.right.isDown) {
//         this.player.setVelocityX(speed);
//         this.player.anims.play("player-right", true); // Change animation key
//       } else if (this.cursors.up.isDown) {
//         this.player.setVelocityY(-speed);
//         this.player.anims.play("player-up", true); // Change animation key
//       } else if (this.cursors.down.isDown) {
//         this.player.setVelocityY(speed);
//         this.player.anims.play("player-down", true); // Change animation key
//       } else {
//         this.player.anims.stop();
//         // Optional: set a static frame when stopped
//       }
//     }

//     // Check for level exit based on player position (adjust coordinates)
//     if (this.player.x > 550 && this.player.x < 700 && this.player.y > 1200) {
//       this.goToNextLevel();
//     }
//   }
// } /////////////////// end of class TemplateScene //////////////////////////////
