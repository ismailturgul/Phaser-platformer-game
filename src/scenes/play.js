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
    const playerZones = this.getPlayerZones(layers.playerZones);
    const player = this.createPlayer(playerZones);

    this.createPlayerColliders(player, {
      colliders: {
        platformColliders: layers.platformColliders,
      },
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
    const playerZones = map.getObjectLayer("player_zones");
    platformColliders.setCollisionByProperty({ collides: true }, -1, true);

    return { environment, platforms, platformColliders, playerZones };
  }

  createPlayer({start}) {
    return new Player(this, start.x, start.y);
  }
  createPlayerColliders(player, { colliders }) {
    player.addCollider(colliders.platformColliders);
  }
  setupFollowupCameraOn(player) {
    const { height, width, mapOffset, zommFactor } = this.config;
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 100);
    this.cameras.main
      .setBounds(0, 0, width + mapOffset, height)
      .setZoom(zommFactor);
    this.cameras.main.startFollow(player);
  }
  getPlayerZones(playerZonesLayer) {
    const playerZones = playerZonesLayer.objects;
    return {
      start: playerZones.find((zone) => zone.name === "startZone"),
      end: playerZones.find((zone) => zone.name === "endZone"),
    };
  }
}

export default Play;
