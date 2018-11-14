// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Astronaut = require("Astronaut");
var GameManager = require("GameManager");

cc.Class({
    extends: cc.Component,

    properties: {
		bullet: { default: null, type: cc.Node },
		astronaut: { default: null, type: Astronaut },
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
        gameManager: {default: null, type: GameManager},
    },

	// Privates
	
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN,function(event){
            //console.log("mouse down event detected in lane");
			this.fire_bullet();
			event.stopPropagation();
        }, this);
	},

    start () {
    },
	
	fire_bullet()
	{
		//console.log("Firing bullet");
		
		// Move astronaut
		this.astronaut.changeTrack(this.node);
			
		if (this.gameManager.canFireBullet())
		{
			var scene = cc.director.getScene();
			var bullet = cc.instantiate(this.bullet);
			bullet.position = cc.v2(25, 0);
			this.node.addChild(bullet);
			bullet.active = true;
			
			this.gameManager.firedBullet();
		}
	},

    // update (dt) {},
});
