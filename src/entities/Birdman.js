import Enemy from "./Enemy";
import initAnims from "./anims/BirdmanAnims";

class Birdman extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, "birdman");
    initAnims(scene.anims);
  }

  update(time, delta) {
    super.update(time, delta);  // make sure that super is also updated
    this.play("birdman-idle", true);
  }
}

export default Birdman;
