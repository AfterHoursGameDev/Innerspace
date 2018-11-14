// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var PlantSpawnPoint = require("PlantSpawnPoint");

cc.Class({

    extends: cc.Component,

    properties: {
        spawnTimeMin: 1,
        spawnTimeMax: 8,
        nextSpawnTime: 0,
        plantPrefab: {default: null, type: cc.Prefab},
        spawnPoints: {default: [], type: PlantSpawnPoint},
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
        var plantNode = cc.instantiate(this.plantPrefab);
        var plantSpawn = this.spawnPoints[idx];
        plantSpawn.assignSpawnedPlant(plantNode);
    },

    onPlantHarvested(event) {
        // TODO - do something with harvested plant
        console.log("Plant harvested!");
    },

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    },
});
