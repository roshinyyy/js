//  class main extends Phaser.Scene {
//   constructor() {
//     super({
//       key: "main",
//     });

//     Put global variable here
//   }

//   preload() {
//     this.load.image("introImg", "assets/intro.jpg");

//     Preload all the assets here

//     Preload any images here

//     Preload any sound and music here
    
//     this.load.audio('ping', 'assets/ping.mp3');
//     this.load.audio('bgMusic', 'assets/bgMusic.mp3');
//   }

//   create() {
//     console.log("* main scene");

//     this.add.image(320, 320, "introImg").setOrigin(0.5, 0.5).setScale(0.7);

//     let key1 = this.input.keyboard.addKey(49);
//     let key2 = this.input.keyboard.addKey(50);
//     let key3 = this.input.keyboard.addKey(51);

//     key1.on(
//       "down",
//       function () {
//         this.scene.start("world");
//       },
//       this
//     );

//     key2.on(
//       "down",
//       function () {
//         this.scene.start("room1");
//       },
//       this
//     );

//     key3.on(
//       "down",
//       function () {
//         this.scene.start("room2");
//       },
//       this
//     );

//     Add any sound and music here
//     ( 0 = mute to 1 is loudest )
//     this.music = this.sound.add('bgMusic').setVolume(0.3) //

//     this.music.play()
//     window.music = this.music
//     turn on loop, adjust the volume
    
 

//     Add image and detect spacebar keypress
//     this.add.image(0, 0, 'main').setOrigin(0, 0);

//     Check for spacebar or any key here
//     var spaceDown = this.input.keyboard.addKey("SPACE");

//     On spacebar event, call the world scene
//     spaceDown.on(
//       "down",
//       function () {
//         console.log("Jump to howtoplay scene");

//         this.scene.start(
//           "howtoplay",
//           Optional parameters
//           {}
//         );
//       },
//       this
//     );

//     Add any text in the main page
//     this.add.text(90, 600, 'Press spacebar to continue', {
//         font: '30px Courier',
//         fill: '#FFFFFF'
//     });

//     Create all the game animations here
//   }
// }
