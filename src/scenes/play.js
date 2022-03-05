import Phaser from "phaser";
import Player from "../entities/player";

class Play extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
  }

  create() {
    const map = this.createMap();
    const layers = this.createLayers(map);
    const player = this.createPlayer();

    this.createPlayerColliders(player, {colliders: {
      platformColliders: layers.platformColliders
    }
  });


  this.setupFollowupCameraOn(player);
  }

  createMap() {
    const map = this.make.tilemap({ key: "map" });
    map.addTilesetImage("main_lev_build_1", "tiles-1");
    return map;
  }
  createLayers(map) {
    const tileset = map.getTileset("main_lev_build_1");
    const platformColliders = map.createStaticLayer(
      "platforms_colliders",
      tileset
    );
    const environment = map.createStaticLayer("environment", tileset);
    const platforms = map.createStaticLayer("platforms", tileset);

    platformColliders.setCollisionByProperty({ collides: true }, -1, true);

    return { environment, platforms, platformColliders };
  }

  createPlayer() {
    return new Player(this,100,250);
  }
  createPlayerColliders(player, { colliders }){
    player.addCollider(colliders.platformColliders);
  }
  setupFollowupCameraOn(player){
    const { height, width, mapOffset } = this.config;
    this.physics.world.setBounds(0, 0, width + mapOffset, height);
    this.cameras.main.setBounds(0,0, width + mapOffset, height);
    this.cameras.main.startFollow(player);
  }
}

export default Play;
