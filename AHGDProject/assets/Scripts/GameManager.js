// GameManager.js

cc.Class({
    extends: cc.Component,

    properties: {
        // amount of hits from aliens that the player can take
        startingHealth: 30,
        // amount of harvests needed to finish the level
        requiredResources: 30,
    },

    currentHealth: 0,
    currentResources: 0,

    start () {
        this.currentHealth = this.startingHealth;
        this.currentResources = 0;
    },

    update (dt) {
        if (this.currentHealth <= 0) {
            this.endGame(false);
        }
        else if (this.currentResources >= this.requiredResources) {
            this.endGame(true);
        }
    },

    // CBO - currently called from PlantManager.onPlantHarvested
    harvestPlant() {
        this.currentResources = this.currentResources + 1;
    },

    // CBO - currently called from Alien.attach()
    takeDamage(event) {
        this.currentHealth = this.currentHealth - 1;
    },

    endGame (victory) {
        // CBO - clean this up
        cc.find("UI_Menu").getComponent("Menu").onEndGame(victory);
    }
});
