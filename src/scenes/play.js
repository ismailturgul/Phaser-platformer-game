import Phaser from "phaser";
import Player from "../entities/player";
import Enemies from "../groups/Enemies";

class Play extends Phaser.Scene {
  constructor(config) {
    super("PlayScene");
    this.config = config;
  }

  create() {
    const map = this.createMap();
    const layers = this.createLayers(map);
    const playerZones = this.getPlayerZones(layers.playerZones);
    const player = this.createPlayer(playerZones.start);
    const enemies = this.createEnemies(layers.enemySpawns);

    this.createPlayerColliders(player, {
      colliders: {
        platformColliders: layers.platformColliders,
      },
    });
    this.createEnemyColliders(enemies, {
      colliders: {
        platformColliders: layers.platformColliders,
        player, // create the function to collide with the player
      },
    });
    this.plotting = false;
    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);

    this.graphics = this.add.graphics();
    this.line = new Phaser.Geom.Line();
    this.graphics.lineStyle(1, 0x00ff00);

    this.input.on("pointerdown", this.startDrawing, this);
    this.input.on(
      "pointerup",
      (pointer) => this.finishDrawing(pointer, layers.platforms),
      this
    );
  }

  startDrawing(pointer) {
    this.line.x1 = pointer.worldX;
    this.line.y1 = pointer.worldY;
    this.plotting = true;
  }
  finishDrawing(pointer, layer) {
    this.line.x2 = pointer.worldX;
    this.line.y2 = pointer.worldY;

    this.graphics.clear();
    this.graphics.strokeLineShape(this.line);

    console.log(layer);

    this.tileHits = layer.getTilesWithinShape(this.line);

    if (this.tileHits.length > 0) {
      this.tileHits.forEach((tile) => {
        if (tile.index !== -1) {
          console.log("i hit the platform");
        }
      });
    }
    this.plotting = false;
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
    const enemySpawns = map.getObjectLayer("enemy_spawns");
    const environment = map.createStaticLayer("environment", tileset);
    const platforms = map.createStaticLayer("platforms", tileset);
    const playerZones = map.getObjectLayer("player_zones");
    platformColliders.setCollisionByProperty({ collides: true }, -1, true);

    return {
      environment,
      platforms,
      platformColliders,
      playerZones,
      enemySpawns,
    };
  }

  createPlayer(start) {
    return new Player(this, start.x, start.y);
  }

  createEnemies(spawnLayer) {
    const enemies = new Enemies(this);
    const enemyTypes = enemies.getTypes();
    spawnLayer.objects.forEach((spawnPoint) => {
      const enemy = new enemyTypes[spawnPoint.type](
        this,
        spawnPoint.x,
        spawnPoint.y
      );
      enemies.add(enemy);
    });

    return enemies;
  }

  createPlayerColliders(player, { colliders }) {
    player.addCollider(colliders.platformColliders);
  }

  createEnemyColliders(enemies, { colliders }) {
    enemies
      .addCollider(colliders.platformColliders)
      .addCollider(colliders.player); // enemy collides with player
  }

  setupFollowupCameraOn(player) {
    const { height, width, mapOffset, zoomFactor } = this.config;
    this.physics.world.setBounds(0, 0, width + mapOffset, height + 100);
    this.cameras.main
      .setBounds(0, 0, width + mapOffset, height)
      .setZoom(zoomFactor);
    this.cameras.main.startFollow(player);
  }

  getPlayerZones(playerZonesLayer) {
    const playerZones = playerZonesLayer.objects;
    return {
      start: playerZones.find((zone) => zone.name === "startZone"),
      end: playerZones.find((zone) => zone.name === "endZone"),
    };
  }

  createEndOfLevel(end, player) {
    const endOfLevel = this.physics.add
      .sprite(end.x, end.y, "end")
      .setAlpha(0)
      .setSize(5, 200)
      .setOrigin(0.5, 1);

    const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
      eolOverlap.active = false;
      console.log("player has won!");
    });
  }

  update() {
    if (this.plotting) {
      const pointer = this.input.activePointer;
      this.line.x2 = pointer.worldX;
      this.line.y2 = pointer.worldY;
      this.graphics.clear();
      this.graphics.strokeLineShape(this.line);
    }
  }
}

export default Play;
