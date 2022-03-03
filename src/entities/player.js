import Phaser from "phaser";

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.init();
    this.initEvents();
  }
  init() {
    this.gravity = 500;
    this.playerSpeed = 200;
    this.body.setGravityY(500);
    this.setCollideWorldBounds(true);
  }

  initEvents(){
      this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  preUpdate() {

    const { left, right } = this.cursors;

    if (left.isDown) {
      this.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.setVelocityX(this.playerSpeed);
    } else {
      this.setVelocityX(0);
    }
  }
}

export default Player;
