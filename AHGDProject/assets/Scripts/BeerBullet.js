// Learn cc.Class:
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        speed: {
            default: 100,
            min: 0
        },

        direction: cc.v2(1, 0),

        collisionTag: {
            default: 0,
            type: cc.Integer,
            min: 0
        },

        particle: {
            default: null,
            type: cc.ParticleSystem
        }
    },

    // May need to be called only once like by a game manager
    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    // May need to be called only once like by a game manager
    onDisable: function () {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    // onLoad () {},

    start () {
		console.log("Bullet started");
    },

    update (dt) {
        var newPos = this.direction.clone();
        newPos.mulSelf(this.speed * dt);
        newPos.addSelf(this.node.position);
		console.log(newPos.toString());
		this.node.position = newPos;
    },

    onCollisionEnter (other, self) {
        if (other.tag == this.collisionTag){
			console.log("Bullet destroyed!");
            this.node.destroy();
        }
    }
});
