import Phaser from "phaser";

var Player = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Player (scene, x, y, gameState) {
      Phaser.GameObjects.Image.call(this, scene, x, y, 'blue_pixel');
      this.keyboard = scene.input.keyboard.addKeys({
        'W': Phaser.Input.Keyboard.KeyCodes.W,
        'A': Phaser.Input.Keyboard.KeyCodes.A,
        'S': Phaser.Input.Keyboard.KeyCodes.S,
        'D': Phaser.Input.Keyboard.KeyCodes.D,
        'UP': Phaser.Input.Keyboard.KeyCodes.UP,
        'LEFT': Phaser.Input.Keyboard.KeyCodes.LEFT,
        'DOWN': Phaser.Input.Keyboard.KeyCodes.DOWN,
        'RIGHT': Phaser.Input.Keyboard.KeyCodes.RIGHT,
      });
      this.gameState = gameState;
      this.life = 100;
      this.fire_rate = 800;
      this.speed = 300;
      this.last_shot = 0;
      this.restore_hit = 3000;
      this.restore_time = 3000;
      this.canBeHit = true;
      this.quadtant = {
        head: 0,
        body: 0
      };
      scene.physics.add.existing(this);
      this.setDisplaySize(20, 32, true);
      this.body.useDamping=true;
      this.body.bounce.x = 0.2;
      this.body.bounce.y = 0.2;
      this.body.damping = 0.9;
      this.body.maxSpeed = 300;
      this.body.setDrag(0.8);
      this.body.collideWorldBounds=true;
      this.range = 0;
      // scene.cameras.main.backgroundColor.setTo(255,255,255);
      scene.cameras.main.startFollow(this);
      let colliders = {
        player2walls: scene.physics.add.collider(this, gameState.groups.walls),
        player2blocks: scene.physics.add.collider(this, gameState.groups.blocks),
        player2holes: scene.physics.add.collider(this, gameState.groups.holes),
        player2enemies: scene.physics.add.overlap(this, gameState.groups.enemies, (player, enemy) => {
          if(this.canBeHit){
            this.restore_hit = 0;
            this.life--;
            enemy.life--;
            console.log(this.life)
          }
        })

      }
      this.colliders = colliders;
    },

    update: function (time, delta, state){
      // this.colliders.walls.active = false;

      if(this.life <= 5){

        this.destroy();
        return;
      }
      //increase last shot timer
      this.last_shot += delta;
      //increase restore hit timer
      this.restore_hit += delta;

      this.canBeHit = this.restore_hit > this.restore_time;
      this.restore_hit += delta;

      //MOVE
      let isUp    = this.keyboard.UP.isDown;
      let isDown  = this.keyboard.DOWN.isDown;
      let isRight = this.keyboard.RIGHT.isDown;
      let isLeft  = this.keyboard.LEFT.isDown;
      let isShootingUp = this.keyboard.W.isDown;
      let isShootingDown = this.keyboard.S.isDown;
      let isShootingLeft = this.keyboard.A.isDown;
      let isShootingRight =  this.keyboard.D.isDown

      if(isUp || isDown || isLeft || isRight){
        if(isUp){
          this.body.velocity.y = -this.speed;
        }
        if(isDown){
          this.body.velocity.y = this.speed;
        }
        if(isRight){
          this.body.velocity.x = this.speed;
        }
        if(isLeft){
          this.body.velocity.x = -this.speed;
        }
        this.quadtant.body = Math.round(4 * Math.atan2(this.body.velocity.y, this.body.velocity.x) / (2*Math.PI) + 4) % 4 ;
      }
      //IF SHOOT
      let isShooting = false;
      if(isShootingUp || isShootingDown || isShootingLeft || isShootingRight){
        isShooting = true;
        if(isShootingUp){
          this.quadtant.head = 3;
        }
        else if(isShootingDown){
          this.quadtant.head = 1;
        }
        else if(isShootingLeft){
          this.quadtant.head = 2;
        }
        else if(isShootingRight){
          this.quadtant.head = 0;
        }
        if(this.last_shot > this.fire_rate){
          let bullet = this.gameState.groups.friendly_bullets.get(this.gameState);
          bullet.fire(this.body.center.x, this.body.center.y, this.quadtant.head);
          this.last_shot = 0;
        }
      }
      if(!isShooting){
        this.quadtant.head = this.quadtant.body;
      }
    }
});

export default Player;
