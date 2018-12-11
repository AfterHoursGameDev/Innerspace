// GameManager.js

cc.Class({
    extends: cc.Component,

    properties: {
      // amount of hits from aliens that the player can take
      startingHealth: 30,
      // amount of harvests needed to finish the level
      requiredResources: 1000.0,
  		requiredPlants: 3,
  		rewardPerRecipe: 100.0,
  		startingResources: 300.0,
  		fuelBar: { default: null, type: cc.ProgressBar },
  		plant1Bar: { default: null, type: cc.ProgressBar },
  		plant2Bar: { default: null, type: cc.ProgressBar },
  		plant3Bar: { default: null, type: cc.ProgressBar },
    },

    currentHealth: 0,

    start () {
        this.currentHealth = this.startingHealth;
        this.currentResources = this.startingResources;
	      this.updateFuelBar();
	      this.plantLevels = {};
	      this.plantLevels[0] = 0;
	      this.plantLevels[1] = 0;
	      this.plantLevels[2] = 0;
    },

    update (dt) {
        if (this.currentHealth <= 0) {
            this.endGame(false);
        }
        else if (this.currentResources >= this.requiredResources) {
            this.endGame(true);
        }
	      this.updatePlantBars();
	      this.updateFuelBar();
    },

	updateFuelBar()
	{
		this.fuelBar.progress = this.currentResources / this.requiredResources;
	},

	updatePlantBars()
	{
		this.plant1Bar.progress = this.plantLevels[0] / this.requiredPlants;
		this.plant2Bar.progress = this.plantLevels[1] / this.requiredPlants;
		this.plant3Bar.progress = this.plantLevels[2] / this.requiredPlants;
	},

    // CBO - currently called from PlantManager.onPlantHarvested
  harvestPlant(plantType) {
		if ((plantType >= 0) && (plantType <= 2)) {
			this.plantLevels[plantType]++;
			if (this.plantLevels[plantType] >= this.requiredPlants) {
				this.plantLevels[plantType] = 0;
				this.currentResources = this.currentResources + this.rewardPerRecipe;
				if (this.currentResources > this.requiredResources) {
					this.currentResources = this.requiredResources;
				}
			}
		}
		this.updateFuelBar();
  },

  // CBO - currently called from Alien.attach()
  takeDamage(event) {
        this.currentHealth = this.currentHealth - 1;
  },

	canFireBullet()
	{
		return (this.currentResources > 0)?true:false;
	},

	firedBullet()
	{
		if (this.currentResources >= 1)
		{
			this.currentResources--;
			this.updateFuelBar();
		}
	},

    endGame (victory) {
        // CBO - clean this up
        cc.find("UI_Menu").getComponent("Menu").onEndGame(victory);
    }
});
