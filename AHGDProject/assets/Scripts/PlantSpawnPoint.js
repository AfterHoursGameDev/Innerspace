// PlantSpawnPoint.js

cc.Class({
    extends: cc.Component,

    properties: {
        activePlant: { default: null, type: cc.Node },
        hasActivePlant: {
            get () {
                return this.activePlant != null;
            }
        }
    },

    onLoad() {
    	this.node.on('plantHarvested', function(event) {
    		this.onPlantHarvested(event);
    	}, this);
    },

    assignSpawnedPlant(plantNode) {
        this.activePlant = plantNode;
        this.activePlant.parent = this.node;
        this.activePlant.pos = cc.v2(0,0);
    },

    onPlantHarvested(event) {
    	// If it's a dead plant, don't propigate event up (no resources harvested)
    	if (!event.mature) {
    		event.stopPropagation();
    	}
    	this.activePlant = null;
    },
});
