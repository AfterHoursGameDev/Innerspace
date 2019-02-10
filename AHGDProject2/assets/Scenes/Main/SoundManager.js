
cc.Class({
	extends: cc.Component,

	properties: {
		backgroundMusic: { default: null, type: cc.AudioClip },
		audioSources: { default: [], type: cc.AudioSource },
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad () {
		// Persist the title screen
		cc.game.addPersistRootNode(this.node);

		cc.audioEngine.playMusic(this.backgroundMusic, true);
	},

	start () {
		console.log('Sound started');
	},

	playSound (index) {
		this.audioSources[index].play();
	},

	// update (dt){
		// console.log('Sound here');
	// },
});
