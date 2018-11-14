// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
