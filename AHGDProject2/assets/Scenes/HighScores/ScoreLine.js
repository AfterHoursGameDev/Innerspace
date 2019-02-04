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
		iconSprite: { default: null, type: cc.Sprite },
		nameLabel: { default: null, type: cc.Label },
		scoreLabel: { default: null, type: cc.Label },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		this.iconSprite = this.node.getChildByName("Icon").getComponent(cc.Sprite);
		this.nameLabel = this.node.getChildByName("Name").getComponent(cc.Label);
		this.scoreLabel = this.node.getChildByName("Score").getComponent(cc.Label);
	},

    start () {
    },
	
	SetLine(iconUrl, name, score)
	{
		console.log("SetLine: " + iconUrl + ", " + name + ", " + score);
		console.log(this.nameLabel);
		this.nameLabel.string = name;
		this.scoreLabel.string = score;
		this.iconSprite.spriteFrame = null;
		if (iconUrl != null)
		{
			cc.loader.load({url: iconUrl, type: 'png'},  (err, texture) =>
				{
					// Use texture to create sprite frame
					cc.log("tex width: " + texture.width);
					cc.log("tex height: " + texture.height);
					this.iconSprite.spriteFrame = new cc.SpriteFrame(texture);
					//this.iconSprite.node.setScale(36/texture.width); // resize to 36x36
					this.iconSprite.node.width = 36; // resize to 36x36
					this.iconSprite.node.height = 36; // resize to 36x36
				});
		}
	},

    // update (dt) {},
});
