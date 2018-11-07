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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN,function(event){
            this.onClicked();
        }, this);
    },

    onClicked() {
        switch (this.state) {
            case PlantState.Growing:
                console.log("Plant still growing, no effect.");
                break;
            case PlantState.Mature:
                this.harvestMaturePlant();
                break;
            case PlantState.Dead:
                this.harvestDeadPlant();
                break;
        }
    },

    harvestMaturePlant() {
        console.log("Harvesting mature plant.");

        // TODO - Report to the player's harvest manager

        this.destroyPlant();
    },

    harvestDeadPlant() {
        console.log("Harvesting dead plant.");

        // TODO - Report to the player's harvest manager - half points?

        this.destroyPlant();
    },

    destroyPlant() {
        this.node.destroy();
    },

});
