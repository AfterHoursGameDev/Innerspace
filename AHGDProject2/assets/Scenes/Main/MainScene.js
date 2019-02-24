// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var SoundManager = require("SoundManager");
var SoundType = require("SoundType");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
		NameOnDisplay: { default: null, type: cc.Label },
		SoundManager: { default: null, type: SoundManager },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
		window.GlobalData = { 
			Score: 0,
		};
		var myName = "---";
		if (typeof FBInstant !== 'undefined') {
			var myName = FBInstant.player.getName();
			FBInstant.getLeaderboardAsync('TopScores')
				  .then(leaderboard => {
					console.log(leaderboard.getName()); // 'TopScores'
				  }).catch(error => console.error(error));
				  
			// Get top 10 in leaderboard
			FBInstant.getLeaderboardAsync("TopScores")  .then(leaderboard => leaderboard.getEntriesAsync(10, 0)).then(entries => {
				console.log("TOP SCORES (" + entries.length + " entries)")
				for (var i = 0; i < entries.length; i++) {
					console.log("#" + entries[i].getRank() + " " + entries[i].getPlayer().getName() + ": " + entries[i].getScore());
				}
			}).catch(error => console.error(error));
		}
		this.NameOnDisplay.string = myName;
    },
	
	PlayPressed()
	{
		window.SoundManager.playSound(SoundType.Button, false);
		cc.director.loadScene("Game");
	},
	
	CreditsPressed()
	{
		window.SoundManager.playSound(SoundType.Button, false);
		cc.director.loadScene("Credits");
	},
	
	InvitePressed()
	{
		window.SoundManager.playSound(SoundType.Button, false);
		if (typeof FBInstant !== 'undefined') {
			console.log("Sharing");
			FBInstant.shareAsync({
			  intent: 'REQUEST',
			  image: 'data:image/png;base64,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',
			  text: FBInstant.player.getName() + ' is asking for your help!',
			}).then(function() {
				// continue with the game.
			}).catch(error => console.error(error));
		}
	},
	
	HighScoresPressed()
	{
		window.SoundManager.playSound(SoundType.Button, false);
		cc.director.loadScene("HighScores");
	},

	QuitGame(){
		window.SoundManager.playSound(SoundType.Button, false);
		if (typeof FBInstant !== 'undefined') {
			FBInstant.quit();
		}
		else{
			cc.game.end();
		}
	}

    // update (dt) {},
});
