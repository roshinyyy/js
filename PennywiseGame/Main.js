class main extends Phaser.Scene {

  constructor() {
      super({
          key: 'main'
      });

      // Put global variable here
  }

  preload() {

      // Preload all the assets here

      // Preload any images here
       // Images
       this.load.image("intro", "asset/introduction.jpg");

      // Preload any sound and music here
      // this.load.audio('ping', 'assets/ping.mp3');
      // this.load.audio('bgMusic', 'assets/bgMusic.mp3');
  }

  create() {

      console.log('*** main scene');

      
// Check for spacebar or any key here
var spaceDown = this.input.keyboard.addKey('SPACE');

let key1 = this.input.keyboard.addKey(49);
let key2 = this.input.keyboard.addKey(50);
let key3 = this.input.keyboard.addKey(51);

key1.on('down', function(){
  this.scene.start("EnterenceTile");
}, this ); 
  key2.on('down', function(){
  this.scene.start("SecondMap");
  }, this );
  ; 


      var spaceDown = this.input.keyboard.addKey('SPACE');
            
      spaceDown.on('down', function () {
          console.log('Jump to story');

          this.scene.start('story',
              // Optional parameters
              {

              }
          );
      }, this);


      // Add any text in the main page
      this.add.text(70, 400, 'Press spacebar to continue', {
          font: '30px Courier',
          fill: '#FFFFFF'
      });


      // Create all the game animations here

  }


}