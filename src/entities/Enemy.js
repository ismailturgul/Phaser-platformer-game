import Phaser from "phaser";
import collidable from "../mixins/collidable";


class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    Object.assign(this, collidable); // mixins
    this.init();
  }

  init() {
    this.gravity = 300;
    this.speed = 200;
   
    this.body.setGravityY(this.gravity);
    this.setSize(20, 45);
    this.setOffset(7,20)
    this.setCollideWorldBounds(true);
    this.setImmovable(true); // makes immovable
    this.setOrigin(0.5, 1)
  }
}

export default Enemy;
