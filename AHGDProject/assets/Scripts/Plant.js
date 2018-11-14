// Plant.js

var PlantState;
PlantState = cc.Enum({
    Growing: 0,
    Mature: 1,
    Dead: 2,
});

cc.Class({
    extends: cc.Component,

    properties: {
        state: { default: PlantState.Growing, type: PlantState },
		plantType: 1, // 1, 2, 3 for plant1 to plant3
    },

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN,function(event) {
            this.onClicked(event);
        }, this);
    },

    onClicked(event) {       
        var didAcceptClick = true;
        switch (this.state) {
            case PlantState.Growing:
                didAcceptClick = false;
                break;
            case PlantState.Mature:
                this.harvestPlant(true);
                break;
            case PlantState.Dead:
                this.harvestPlant(false);
                break;
        } 
        if (didAcceptClick) {
            event.stopPropagation();
        }
    },

    harvestPlant(wasMature) {

        var event = new cc.Event.EventCustom('plantHarvested', true);
        event.mature = wasMature;
		event.plantType = this.plantType;
        this.node.dispatchEvent(event);
        this.node.destroy();
    },
});
