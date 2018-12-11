// PlantManager.js

var PlantSpawnPoint = require("PlantSpawnPoint");
var GameManager = require("GameManager");
var RecipeManager = require("RecipeManager");


cc.Class({

    extends: cc.Component,

    properties: {
        spawnTimeMin: 1,
        spawnTimeMax: 8,
        nextSpawnTime: 0,
        plantPrefabs: {default: [], type: cc.Prefab},
        spawnPoints: {default: [], type: PlantSpawnPoint},
        gameManager: {default: null, type: GameManager},
        recipeManager: {default: null, type: RecipeManager},
    },

    timer: 0.0,

    ctor: function () {
    	this.spawnablePlants = 0;
    	console.log("this.spawnablePlants" + this.spawnablePlants);
    },

    onLoad() {
        this.node.on('plantHarvested', function(event) {
            this.onPlantHarvested(event);
        }, this);
    },

    start () {
    	this.setSpawnablePlants();
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

    setSpawnablePlants() {
    	var spawnablePlants = this.recipeManager.getSpawnablePlants();
    	this.spawnablePlants = 0;
    	for (var i = 0; i < spawnablePlants.length; i++) {
    		this.spawnablePlants += spawnablePlants[i];
    	}
    	console.log("this.spawnablePlants" + this.spawnablePlants);
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
        var randIdx = Math.floor(Math.random() * this.spawnablePlants);
        var plantNode = cc.instantiate(this.plantPrefabs[randIdx]);
        var plantSpawn = this.spawnPoints[idx];
        plantSpawn.assignSpawnedPlant(plantNode);
    },

    onPlantHarvested(event) {
    	// TODO - remove this, let the recipe manager handle keg creation
        this.gameManager.harvestPlant(event.plantType);

        // TODO - pass the event, let RecipeManager determine if harvesting happens
        this.recipeManager.tryHarvestPlant(event.plantType);
    },

    getRandom(min, max) {
        return Math.random() * (max - min) + min;
    },
});
