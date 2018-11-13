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
        },
		
		track: { default: null, type: cc.Node },
    },

    // May need to be called only once like by a game manager
    onEnable: function () {
		//var cmanager = cc.director.getCollisionManager();
        //cmanager.enabled = true;
        //cmanager.enabledDebugDraw = true;
    },

    // May need to be called only once like by a game manager
    onDisable: function () {
		var cmanager = cc.director.getCollisionManager();
        cmanager.enabled = false;
        cmanager.enabledDebugDraw = false;
    },

    // onLoad () {},

    start () {
		//console.log("Bullet started");
		this.track = this.node.getParent();
    },

	checkCollision()
	{
		var right = this.node.position.x + this.node.getContentSize().width/2;
		
		// If a bullet is to the right of an alien's left edge, then it is a collision
		for (var i=0; i<this.track.children.length; i++)
		{
			var target = this.track.children[i];
			// Is it a target we can hit?
			var health = target.getComponent("Health");
			if (health) 
			{
				if (health.health > 0)
				{
					// Is it at the right place?
					if (right >= (target.position.x - target.getContentSize().width/2))
					{
						return target;
					}
				}
			}
		}
		return null;
	},
	
    update (dt) {
        var newPos = this.direction.clone();
        newPos.mulSelf(this.speed * dt);
        newPos.addSelf(this.node.position);
		//console.log(newPos.toString());
		this.node.position = newPos;
		var target = this.checkCollision();
		if (target)
		{
			// Hit alien then destroy bullet
			target.getComponent("Health").take_damage(this, 1, "beer");
            this.node.destroy();
		}
		else if (this.node.position.x > 2000)
		{
			//console.log("Bullet out of range, destroying");
            this.node.destroy();
		}
    },

    onCollisionEnter (other, self) {
		//console.log("Bullet collided!");
        if (other.tag == this.collisionTag){
			// Tell the thing hit that it was hit by a bullet
			other.node.getComponent("Health").take_damage(this, 1, "beer");

			//console.log("Bullet destroyed!");
            this.node.destroy();
			
        }
    }
});
