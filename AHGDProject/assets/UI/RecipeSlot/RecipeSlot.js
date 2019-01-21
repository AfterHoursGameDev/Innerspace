var PlantType = require("PlantType");

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
		Type: { type: PlantType, default: PlantType.Rye},
		NumRemaining: 1,
		NumNeeded: 1,
		MySprite: {type: cc.Sprite, default: null },
		MyXLabel: {type: cc.Label, default: null },
		ImageRye: {type: cc.SpriteFrame, default: null },
		ImageHops: {type: cc.SpriteFrame, default: null },
		ImageFruit: {type: cc.SpriteFrame, default: null },
		ImageBarley: {type: cc.SpriteFrame, default: null },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
		this.UpdateGraphics();
    },
	
	UpdateGraphics()
	{
		switch (this.Type)
		{
			case PlantType.Rye:
				this.MySprite.spriteFrame = this.ImageRye;
				break;
			default:
			case PlantType.Barley:
				this.MySprite.spriteFrame = this.ImageBarley;
				break;
			case PlantType.Hops:
				this.MySprite.spriteFrame = this.ImageHops;
				break;
			case PlantType.Fruit:
				this.MySprite.spriteFrame = this.ImageFruit;
				break;
		}
		
		this.MyXLabel.string = "x"+this.NumRemaining;
		
		if (this.NumRemaining == 0)
		{
			this.MySprite.node.active = false;
			this.MyXLabel.node.active = false;
		}
		else
		{
			this.MySprite.node.active = true;
			this.MyXLabel.node.active = true;
		}
	},
	
	IsFillable(check)
	{
		return (this.Type == check);
	},
	
	Fill()
	{
		if (this.NumRemaining > 0)
		{
			this.NumRemaining--;
			this.UpdateGraphics();
		}
	},

    // update (dt) {},
});
