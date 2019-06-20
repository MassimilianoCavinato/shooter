import Phaser from "phaser";
import Wall from "./Wall";
import Player from "./Player";
import Enemy from "./Enemy";
import Bullet from "./Bullet.js";

var json = {
  "shape":7,
  "room_count":10,
  "rooms":[
    {"id":0,"nodeIndex":24,"connections":["TOP-3","LEFT-1","BOTTOM-2","RIGHT-4"],"locked":false,"width":15,"height":13,"enemies":[]},
    {"id":1,"nodeIndex":23,"connections":["BOTTOM-5","RIGHT-0"],"locked":true,"width":10,"height":10,"enemies":["slime","slime","slime"]},
    {"id":2,"nodeIndex":31,"connections":["TOP-0","LEFT-5","BOTTOM-8"],"locked":true,"width":10,"height":10,"enemies":["slime","slime","slime"]},
    {"id":3,"nodeIndex":17,"connections":["BOTTOM-0"],"locked":true,"width":10,"height":10,"enemies":["slime","slime","slime"]},
    {"id":4,"nodeIndex":25,"connections":["LEFT-0"],"locked":true,"width":10,"height":10,"enemies":["slime","slime","slime"]},
    {"id":5,"nodeIndex":30,"connections":["TOP-1","BOTTOM-6","RIGHT-2"],"locked":true,"width":10,"height":10,"enemies":["slime","slime","slime"]},
    {"id":6,"nodeIndex":37,"connections":["TOP-5","LEFT-7","RIGHT-8"],"locked":true,"width":10,"height":10,"enemies":["slime","slime","slime"]},
    {"id":7,"nodeIndex":36,"connections":["BOTTOM-9","RIGHT-6"],"locked":true,"width":10,"height":10,"enemies":["slime","slime","slime"]},
    {"id":8,"nodeIndex":38,"connections":["TOP-2","LEFT-6"],"locked":true,"width":10,"height":10,"enemies":["slime","slime","slime"]},
    {"id":9,"nodeIndex":43,"connections":["TOP-7"],"locked":true,"width":10,"height":10,"enemies":["slime","slime","slime"]}
  ]
}


var Rooms = json.rooms.map(function(room){
  return new Phaser.Class({
      Extends: Phaser.Scene,
      initialize: function Room (a){
        Phaser.Scene.call(this, { key: 'Room'+room.id });
      },
      preload: function(){
        this.load.image("legs", "http://localhost:3001/assets/legs.png");
        this.load.image("head", "http://localhost:3001/assets/head.png");
        this.load.image("red_pixel", "http://localhost:3001/assets/pixel_red.png");
        this.load.image("blue_pixel", "http://localhost:3001/assets/pixel_blue.png");
        this.load.image("green_pixel", "http://localhost:3001/assets/pixel_green.png");
        this.load.image("yellow_pixel", "http://localhost:3001/assets/pixel_yellow.png");
        this.load.image('tileset_Dungeon', 'http://localhost:3001/assets/tileset_Dungeon.png');
        this.load.image('door_locked', 'http://localhost:3001/assets/door_locked.png');
        this.load.tilemapTiledJSON('EntryRoom', 'http://localhost:3001/assets/EntryRoom.json');
      },
      create: function(data){
        var map = this.add.tilemap('EntryRoom');
      	var tileset_Dungeon = map.addTilesetImage('tileset_Dungeon','tileset_Dungeon');
        var gameState = {
          groups: {
            players:          this.add.group({ classType: Player, runChildUpdate: true }),
            enemies:          this.add.group({ classType: Enemy, runChildUpdate: true }),
            friendly_bullets: this.add.group({ classType: Bullet, runChildUpdate: true }),
            enemy_bullets:    this.add.group({ classType: Bullet, runChildUpdate: true }),
            holes:            null,
            walls:            null,
            blocks:           null,
          },
          colliders: {

          }
        }
        map.createStaticLayer('Background', tileset_Dungeon, 0,0);﻿
        gameState.groups.walls = map.createStaticLayer('Walls', tileset_Dungeon, 0,0);﻿
        map.setCollisionBetween(50,50);
        // map.createStaticLayer('Doors', tileset_Dungeon, 0,0);﻿

        var spawnPoints = {
          player: {
            top: {
              x: map.widthInPixels / 2 + 10,
              y: 32 + 64
            },
            right: {
              x: map.widthInPixels - 64,
              y: map.heightInPixels / 2 + 16
            },
            bottom: {
              x: map.widthInPixels / 2 + 10,
              y: map.heightInPixels - 64
            },
            left: {
              x: 32 + 64,
              y: map.heightInPixels / 2 + 16
            },
            center: {
              x: map.widthInPixels / 2 + 10,
              y: map.heightInPixels / 2 + 16
            }
          },
          door: {
            top: {
              x: map.widthInPixels / 2,
              y: 16
            },
            right: {
              x: map.widthInPixels - 16,
              y: (map.heightInPixels / 2)
            },
            bottom: {
              x: map.widthInPixels / 2,
              y: map.heightInPixels - 16
            },
            left: {
              x: 16,
              y: map.heightInPixels / 2
            },
            center: {
              x: map.widthInPixels / 2,
              y: map.heightInPixels / 2
            }
          }
        }

        let room_label = this.add.text(10, 10, 'Room'+room.id);
        room_label.setScrollFactor(0);

        let playerSpawn = spawnPoints.player[data.spawnPosition];

        var player = gameState.groups.players.get(playerSpawn.x , playerSpawn.y, gameState);
        //make doors

        function getOppositeDirection(direction){
          switch(direction){
            case "top": return "bottom";
            case "left": return "right";
            case "bottom": return "top";
            default: return "left"
          }
        }

        json.rooms[room.id].connections.forEach(conn => {
          let direction = conn.split("-")[0].toLowerCase();
          let oppositeDirection = getOppositeDirection(direction);
          let doorSpawn = spawnPoints.door[direction];
          let door = this.add.sprite(doorSpawn.x, doorSpawn.y,'door_locked');
          this.physics.add.existing(door);
          door.scaleX = 1.8;
          door.scaleY = 1.8;
          let nextRoomId = conn.split("-")[1];
          this.physics.add.overlap(door, player, (a, b) => {
            console.log()
            this.scene.start("Room"+nextRoomId, {spawnPosition: oppositeDirection});
          });
        });



        // gameState.groups.blocks = map.createStaticLayer('Blocks', tileset, 0,0);﻿
        // map.setCollisionBetween(41,41);
        // gameState.groups.holes = map.createStaticLayer('Holes', tileset, 0, 0);﻿
        // map.setCollisionBetween(130, 130);

        // gameState.groups.enemies.get(80,120);
        // gameState.groups.enemies.get(120,300);
        // gameState.groups.enemies.get(412,412);

      },
      update: (time, delta) => {

      }
  });
});

export default Rooms;
