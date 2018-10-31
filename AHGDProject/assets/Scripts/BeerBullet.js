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

    // onLoad () {},

    start () {
		console.log("Bullet started");
    },

    update (dt) {
		console.log(this.node);
		// this.node += (this.direction * this.speed * dt);
		this.node.x += this.speed * dt;
    },

    onCollisionEnter (other, self) {
        if (other.tag == this.collisionTag){
			console.log("Bullet destroyed!");
            this.node.destroy();
        }
    }
});
