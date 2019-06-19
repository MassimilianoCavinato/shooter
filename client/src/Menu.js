import Phaser from "phaser";

var Menu = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function Menu (){
        Phaser.Scene.call(this, { key: 'menu' });
    },
    create: function () {
        this.add.text(10, 10, 'WASD to shoot');
        this.add.text(10, 40, 'UP LEFT RIGHT DOWN to move');
        var playButton = this.add.text(377, 260, 'Play', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => this.scene.start('Room0'));
        //
        // this.input.keyboard.once('keyup_SPACE', () => {
        //
        // });
        // this.events.on('shutdown', () => this.shutdown);
    },
    shutdown: function (){
        // this.input.keyboard.shutdown();
    }
});

export default Menu;
