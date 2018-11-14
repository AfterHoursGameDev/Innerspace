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
                this.harvestMaturePlant();
                break;
            case PlantState.Dead:
                this.harvestDeadPlant();
                break;
        }
        if (didAcceptClick) {
            event.stopPropagation();
        }
    },

    harvestMaturePlant() {
        console.log("Harvesting mature plant.");
        // TODO - Report harvest to PlantManager
        this.destroyPlant();
    },

    harvestDeadPlant() {
        console.log("Harvesting dead plant.");
        this.destroyPlant();
    },

    destroyPlant() {
        // TODO - Report to PlantSpawnPoint that the plant has been destroyed
        this.node.destroy();
    },
});
