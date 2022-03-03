import Phaser from "phaser";
import initAnimations from "./playerAnims";
import Collidable from "../mixins/collidable";
import collidable from "../mixins/collidable";


class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    Object.assign(this, collidable);
    this.init();
    this.initEvents();
  }

  init() {
    this.gravity = 300;
    this.playerSpeed = 200;
    this.jumpcount = 0
    this.consecutiveJumps = 1
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.body.setGravityY(500);
    this.setCollideWorldBounds(true);

    initAnimations(this.scene.anims);
  }

  initEvents() {
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
  }

  update() {
    const { left, right, space, up } = this.cursors;
    const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
    const isUpJustDown = Phaser.Input.Keyboard.JustDown(up);
    const onFloor = this.body.onFloor();
    if (left.isDown) {
      this.setVelocityX(-this.playerSpeed);
      this.setFlipX(true);
    } else if (right.isDown) {
      this.setVelocityX(this.playerSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if ((isSpaceJustDown || isUpJustDown) && (onFloor || this.jumpcount < this.consecutiveJumps)){
        this.setVelocityY(-this.playerSpeed * 1.5)
        this.jumpcount++;
    }   
    if(onFloor) {
        this.jumpcount = 0;
    }

    onFloor ? 
    this.body.velocity.x !== 0 ? this.play("run", true) : this.play("idle", true):
    this.play("jump", true)
    }
}

export default Player;
