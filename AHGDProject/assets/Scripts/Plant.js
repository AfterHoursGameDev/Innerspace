// Plant.js

var PlantState;
PlantState = cc.Enum({
    Growing: 0,
    Mature: 1,
    Dead: 2,
});

var PlantType;
PlantType = cc.Enum({
  Barley: 0,
  Hops: 1,
  Rye: 2,
  Fruit: 3,
});

cc.Class({
    extends: cc.Component,

    properties: {
        state: { default: PlantState.Growing, type: PlantState },
	      plantType: {default: PlantType.Barley, type: PlantType },
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_END,function(event) {
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
