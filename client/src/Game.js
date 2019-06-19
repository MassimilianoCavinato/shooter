import React from "react";
import Phaser from "phaser";
import Menu from "./Menu";
import Rooms from "./Rooms";

function Game() {

  Rooms.unshift(Menu);

  var game = new Phaser.Game({
    mode: Phaser.Scale.FIT,
    parent: "shooter",
    width: 800,
    height: 608,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: Rooms
  });

  console.log()
  return (
    <div
      id="shooter"
      style={{
        display: "block",
        margin: 0,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "100%",
        maxHeight: "50vw",
      }}
    >
    </div>
  )
}

export default Game;
