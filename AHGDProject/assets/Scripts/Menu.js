const PLAY_SCENE = 'PlayGame.fire';
const SHOW_MENU = 'showMenu';
const HIDE_MENU = 'hideMenu';
const VICTORY = 'VICTORY';
const GAME_OVER = 'GAME OVER';

var ScoringManager = require("ScoringManager");

cc.Class({
    extends: cc.Component,

    properties: {
        titleGroup: cc.Node,
		gameGroup: cc.Node,
		endGameGroup: cc.Node,
		endGameTitle: cc.Label,
		gameMenuAnim: cc.Animation,
		scoringManager: ScoringManager,
		_showGameMenu: {
			default: false,
			visible: false,
		},
    },

	getScoringManager(){
		return this.scoringManager;
	},

    onLoad () {
		// Persist the title screen
		cc.game.addPersistRootNode(this.node);

		// Disable game group
		this.gameGroup.active = false;

		// Disable end game group
		this.endGameGroup.active = false;
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

	onShareGame () {
		// if (typeof FBInstant === 'undefined') return;
		// FBInstant.shareAsync({
			// intent: 'SHARE',
			// image: this.getImgBase64(),
			// text: 'X is asking for your help!',
			// data: {myReplayData: '...'},
		// }).then(() => {
			// // continue with the game.
		// });
	},

	onEndGame (victory) {
		// Disable game group
		this.gameGroup.active = false;

		if (victory) {
			this.endGameTitle.string = VICTORY;
		}
		else {
			this.endGameTitle.string = GAME_OVER;
		}

		// Enable end game group
		this.endGameGroup.active = true;
		cc.director.pause();
	},

	onRestartGame () {
		// Disable end game group
		this.endGameGroup.active = false;

		if (cc.director.isPaused()) {
			cc.director.resume();
		}

		console.log("Game restarting");
		cc.game.restart();
	},

	onQuitGame () {
		console.log("Game quitting");
		cc.game.end();

		if (typeof FBInstant !== 'undefined') {
			FBInstant.quit();
		}
	},

	_onStartedGame () {
		console.log("Game started");

		// Disable game group
		this.gameGroup.active = true;
	},

	onGameMenuToggle () {
		this._showGameMenu = !this._showGameMenu;
		this.gameMenuAnim.play(this._showGameMenu ? SHOW_MENU : HIDE_MENU);
	},

});
