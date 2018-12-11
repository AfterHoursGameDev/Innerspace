var Plant = require("Plant");
var PlantType = require("PlantType");

cc.Class({
    extends: cc.Component,

    properties: {
        barleyRequired: {default: 0},
        hopsRequired: {default: 0},
        ryeRequired: {default: 0},
        fruitRequired: {default: 0},
        kegsCreated: {default: 1},
    },

    ctor: function () {
        this.ingredientsRequired = [0,0,0,0];
        this.currentIngredients = [0,0,0,0];
    },

    onLoad () {
        this.santizeIngredients();
    },

    start () {

    },

    santizeIngredients() {
        // Don't allow negative ingredient requirements
        if (this.barleyRequired < 0) {
            this.barleyRequired = 0;
        }
        if (this.hopsRequired < 0) {
            this.hopsRequired = 0;
        }
        if (this.ryeRequired < 0) {
            this.ryeRequired = 0;
        }
        if (this.fruitRequired < 0) {
            this.fruitRequired = 0;
        }

        // Don't allow zero keg recipes
        if (this.kegsCreated < 1) {
            this.kegsCreated = 1;
        }
        // These are mapped out to the enum value of the ingredient
        this.ingredientsRequired = this.getRequiredIngredientsList();
    },

    getRequiredIngredientsList() {
        return [this.barleyRequired, this.hopsRequired, this.ryeRequired, this.fruitRequired];
    },

    // Can accept ingredient if we're looking for it and we don't have exactly
    // the number needed
    canAcceptIngredient(plantType) {
        var numNeeded = this.ingredientsRequired[plantType];
        return numNeeded > 0 
            && this.currentIngredients[plantType] != numNeeded;
    },

    addIngredient(plantType) {
        this.currentIngredients[plantType]++;

        // TODO - Notify that we've added an ingredient

        // Check to see if we've complete the recipe
        if (this.checkIfComplete()) {
            this.completeRecipe();
        }
    },

    checkIfComplete() {
        var complete = true;
        for (var i = 0; i < this.ingredientsRequired.length; i++) {
            if (this.currentIngredients[i] != this.ingredientsRequired[i]) {
                complete = false;
                break;
            }
        }
        return complete;
    },

    completeRecipe () {
        // TODO - make a keg
        console.log("We got there boys");
        
        // reset current ingredients
        this.currentIngredients = [0,0,0,0];
    },
});
