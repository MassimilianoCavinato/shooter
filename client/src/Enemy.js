import Phaser from "phaser";

var Enemy = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Enemy (scene, x, y) {
      this.life = 5;
      Phaser.GameObjects.Image.call(this, scene, x, y, 'red_pixel');
      scene.physics.add.existing(this);
      this.scaleX = 20;
      this.scaleY = 32;
      this.body.collideWorldBounds=true;
      this.body.useDamping=true;
      this.body.damping = 0.9;
      this.body.setDrag(0.5);
    },

    update: function (time, delta){
      if(this.life <= 0){
        this.destroy();
      }
    }
});

export default Enemy;
