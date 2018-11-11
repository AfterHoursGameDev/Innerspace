const PLAY_SCENE = 'PlayGame.fire';
const SHOW_MENU = 'showMenu';
const HIDE_MENU = 'hideMenu';

cc.Class({
    extends: cc.Component,

    properties: {
        titleGroup: cc.Node,
		gameGroup: cc.Node,
		gameMenuAnim: cc.Animation,
		_showGameMenu: {
			default: false,
			visible: false,
		},
    },

    onLoad () {
		// Persist the title screen
		cc.game.addPersistRootNode(this.node);

		// Disable game group
		this.gameGroup.active = false;
	},

    start () {

    },

	onStartGame () {
		console.log("Game starting");
		cc.director.loadScene(PLAY_SCENE, this._onStartedGame.bind(this));

		// Disable title group
		this.titleGroup.active = false;
	},

	onPauseGame () {
		if (cc.director.isPaused()) {
			console.log("Game unpaused");
			cc.director.resume();
		}
		else {
			console.log("Game paused");
			cc.director.pause();
		}
	},

	onQuitGame () {
		console.log("Game quitting");
		cc.game.end();
	},

	_onStartedGame () {
		console.log("Game started");
		if (this == null){
			console.log("WTF!!");
		}
		else if (this.gameGroup == null){
			console.log("HOW?!!");
		}
		// Disable game group
		this.gameGroup.active = true;
	},

	onGameMenuToggle () {
		this._showGameMenu = !this._showGameMenu;
		this.gameMenuAnim.play(this._showGameMenu ? SHOW_MENU : HIDE_MENU);
	},

});
