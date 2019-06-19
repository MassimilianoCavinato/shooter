import Phaser from "phaser";

var Wall = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Wall (scene, state) {
      Phaser.GameObjects.Image.call(this, scene, 200, 200, 'green_pixel');
      scene.physics.add.existing(this);
      this.setDisplaySize(64, 64, true);
      this.body.static = true;
      console.log(this.body);
    },
    update: function (time, delta){

    }
});

export default Wall;
