import Phaser from "phaser";
import collidable from "../mixins/collidable";


class Birdman extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "birdman");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    Object.assign(this, collidable); // mixins
    this.init();
  }

  init() {
    this.gravity = 300;
    this.speed = 200;
   
    this.body.setGravityY(500);
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5, 1)
  }
}

export default Birdman;
