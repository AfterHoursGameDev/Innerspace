// PlantManager.js

var PlantSpawnPoint = require("PlantSpawnPoint");
var GameManager = require("GameManager");

cc.Class({

    extends: cc.Component,

    properties: {
        spawnTimeMin: 1,
        spawnTimeMax: 8,
        nextSpawnTime: 0,
        plantPrefabs: {default: [], type: cc.Prefab},
        spawnPoints: {default: [], type: PlantSpawnPoint},
        gameManager: {default: null, type: GameManager},
    },

    timer: 0.0,


    onLoad() {
        this.node.on('plantHarvested', function(event) {
            this.onPlantHarvested(event);
        }, this);
    },

    start () {
        this.resetSpawnTimer();
    },

    update (dt) {
        this.timer += dt;
        if (this.timer >= this.nextSpawnTime)
        {
            this.resetSpawnTimer();
            this.trySpawnPlant();
        }
    },

    resetSpawnTimer () {
        this.timer = 0.0;
        this.nextSpawnTime = this.getRandom(this.spawnTimeMin, this.spawnTimeMax);
    },

    trySpawnPlant() {
        var maxIdx = this.spawnPoints.length - 1;
        var spawnIndex = Math.floor(this.getRandom(0, maxIdx));

        for (var i = 0; i < maxIdx + 1; i++)
        {
            // If we already have a plant here, get the next index and try again
            if (this.spawnPoints[spawnIndex].hasActivePlant)
            {
                spawnIndex = spawnIndex + 1;
                if (spawnIndex > maxIdx)
                {
                    spawnIndex = 0;
                }
            }
            else
            {
				this.spawnPlantAtIndex(spawnIndex);
                break;
            }
        }
    },

    spawnPlantAtIndex(idx) {
        var randIdx = Math.floor(Math.random() * 4);
        var plantNode = cc.instantiate(this.plantPrefabs[randIdx]);
        var plantSpawn = this.spawnPoints[idx];
        plantSpawn.assignSpawnedPlant(plantNode);
    },

    onPlantHarvested(event) {
        this.gameManager.harvestPlant(event.plantType);
    },

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    },
});
