
cc.Class({
	extends: cc.Component,

	properties: {
		_score: {
			default : 0,
			visibile: false,
		},

		_scoreLabel: {
			default: null,
			visibile: false,
		},
	},

	start () {
		this._scoreLabel = this.node.getComponent(cc.Label);
	},

	addScoring (score) {
		this._score = this._score + score;
		this._updateLabel();
	},

	_updateLabel(){
		this._scoreLabel.string = this._score;
	},
});
