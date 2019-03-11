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
		Tokens: { default: [], type: cc.Sprite },
		GoalPoint: { default: null, type: cc.Node },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

	StartToken(type, startpos)
	{
		var rootPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
		var nextPos = startpos;
		nextPos = nextPos.sub(rootPos);
		var token = this.Tokens[type];
		token.node.setPosition(nextPos);
		token.node.scale = cc.v2(1.0, 1.0);
		token.node.runAction(new cc.scaleTo(0.35, 0.1));
		var goalpos = this.GoalPoint.convertToWorldSpaceAR(cc.v2(0, 0));
		goalpos.subSelf(rootPos);
		var moveAction = new cc.moveTo(0.35, goalpos);
		moveAction.easing(cc.easeExponentialInOut(moveAction));
		token.node.runAction(cc.sequence(moveAction, cc.callFunc(function() { token.node.setPosition(cc.v2(-10000.0, 0)); }, this)));
	},
	
    start () {

    },
	
	Finished()
	{
	console.log("Finished");
	},

    // update (dt) {},
});
