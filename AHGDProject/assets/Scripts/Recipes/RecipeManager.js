// RecipeManager.js

var Recipe = require("Recipe");

cc.Class({
    extends: cc.Component,

    properties: {
        recipes: {default: [], type: Recipe},
    },

    getSpawnablePlants() {
        var spawnable = [0, 0, 0, 0];

        for (var i = 0; i < this.recipes.length; i++) {
            var requiredIngredients = this.recipes[i].getRequiredIngredientsList();
            for (var j = 0; j < requiredIngredients.length; j++) {
                if (spawnable[j] < 1 && requiredIngredients[j] > 0) {
                    spawnable[j] = 1;
                }
            }
        }
        return spawnable;
    },

    tryHarvestPlant(plantType) {
        var numWanting = 0;
        var wantsIngredient = [];

        // Create a list of all recipes that want this ingredient
        for (var i = 0, j = 0; i < this.recipes.length; i++) {
            if (this.recipes[i].canAcceptIngredient(plantType)) {
                wantsIngredient[j] = i;
                j++
            }
        }

        // If we only have one Recipe that wants this ingredient, consume it!
        if (wantsIngredient.length == 1) {
            this.recipes[wantsIngredient[0]].addIngredient(plantType);
        }
        else if (wantsIngredient.length > 1) {
            // TODO - handle multiple recipes wanting the same ingredient
            // For now, just put it in the first one.
            this.recipes[wantsIngredient[0]].addIngredient(plantType);
        }
    }
});
