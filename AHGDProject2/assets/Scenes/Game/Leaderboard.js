// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
		this.getLeaderboard();
    },

    // update (dt) {},

	updateLeaderboard (score) {
		if (typeof FBInstant !== 'undefined') {
			FBInstant.getLeaderboardAsync('All Friends.' + FBInstant.context.getID())
			  .then(leaderboard => {
				console.log(leaderboard.getName());
				return leaderboard.setScoreAsync(score);
			  })
			  .then(() => console.log('Score saved'))
			  .catch(error => console.error(error));
		}
	},

	getLeaderboard () {
		if (typeof FBInstant !== 'undefined') {
			FBInstant.getLeaderboardAsync('All Friends.' + FBInstant.context.getID())
			  .then(leaderboard => leaderboard.getEntriesAsync(10, 0))
			  .then(entries => {
				for (var i = 0; i < entries.length; i++) {
				  console.log(
					entries[i].getRank() + '. ' +
					entries[i].getPlayer().getName() + ': ' +
					entries[i].getScore()
				  );
				}
			  }).catch(error => console.error(error));
		}
	},

	getLeaderboardForPlayer () {
		if (typeof FBInstant !== 'undefined') {
			FBInstant.getLeaderboardAsync('All Friends.' + FBInstant.context.getID())
			  .then(leaderboard => leaderboard.getPlayerEntryAsync())
			  .then(entry => {
				console.log(
				  entries[i].getRank() + '. ' +
				  entries[i].getPlayer().getName() + ': ' +
				  entries[i].getScore()
				);
			  }).catch(error => console.error(error));
		}
	},
});
