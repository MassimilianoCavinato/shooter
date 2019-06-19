import Phaser from "phaser";


var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Bullet (scene, gameState) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'red_pixel');
        scene.physics.add.existing(this);
        this.setDisplaySize(12, 12, true);
        this.body.collideWorldBounds=true;
        this.lifespan = 0;
        this.speed = 500;
        scene.physics.add.collider(this, gameState.groups.blocks, function(bullet, block) {
          bullet.destroy()
        });
        scene.physics.add.collider(this, gameState.groups.enemies, function(bullet, enemy) {
          bullet.destroy();
          enemy.life--;
        });
        scene.physics.add.collider(this, gameState.groups.walls, function(bullet, wall) {
          bullet.destroy()
        });
    },

    fire: function (x, y, quadtant){
      this.x = x;
      this. y = y;
      if(quadtant === 0){
        this.body.velocity.x = this.speed;
        this.body.velocity.y = 0;
      }
      else if(quadtant === 1){
        this.body.velocity.x = 0;
        this.body.velocity.y = this.speed;
      }
      else if(quadtant === 2){
        this.body.velocity.x = -this.speed;
        this.body.velocity.y = 0;
      }
      else if(quadtant === 3){
        this.body.velocity.x = 0;
        this.body.velocity.y = -this.speed;
      }
      this.lifespan = 800;
    },

    update: function (time, delta){
      this.lifespan -= delta;
      if (this.lifespan <= 0){
          this.destroy();
      }
    }
});
export default Bullet;
