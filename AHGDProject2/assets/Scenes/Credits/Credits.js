
var SoundManager = require("SoundManager");
var SoundType = require("SoundType");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

	ExitPressed()
	{
		window.SoundManager.playSound(SoundType.Button, false);
		window.SoundManager.continueBackgroundMusic();
		cc.director.loadScene("MainScene");
	},
});
