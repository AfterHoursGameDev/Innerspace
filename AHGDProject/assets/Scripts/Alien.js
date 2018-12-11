// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var EnAlienState;
EnAlienState = cc.Enum({
	MoveForward: 0,
	Attack: 1,
	Stunned: 2,
	Dying: 3,
	AttackCooldown: 4,
});

//var BulletTarget = require('BulletTarget');

cc.Class({
//    extends: BulletTarget,
    extends: cc.Component,

    properties: {
		track: { default: null, type: cc.Node },
		left: 0,
		right: 0,
		pos: 0,
		move_speed: 100,
		attack_speed: 0.7,
		attack_cooldown: 0.5,
		stun_speed: 1.0,
		state: { default: EnAlienState.MoveForward, type: EnAlienState },
		
		image: { default: null, type: cc.SpriteFrame },
		imageAttacking: { default: null, type: cc.SpriteFrame },
		imageStunned: { default: null, type: cc.SpriteFrame },
		imageDying: { default: null, type: cc.SpriteFrame },
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

	// Private variables
	attack_time: 0,
	stun_time: 0,
	sprite: null,

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
	{
		this.node.on("took_damage", this.took_damage, this);
		this.node.on("died", this.died, this);
		this.sprite = this.node.getComponent(cc.Sprite);
		
		this.node.on(cc.Node.EventType.TOUCH_END,function(event) {
			this.fire_at(event);
        }, this);
	},

    start ()
	{
		if (this.track != null) 
		{
			this.left = 100;
			this.right = this.track.getContentSize().width;
			this.pos = this.right;
			this.node.position = cc.v2(this.pos, 0);
		} 
		else 
		{
			console.warn("Alien NOT on track!");
		}
    },
	
	start_attack()
	{
		this.state = EnAlienState.Attack;
		this.attack_time = 0;
		this.sprite.spriteFrame = this.imageAttacking;
	},
	
	attack() {
		// CBO - Please fix this!
		cc.find("GameManager").getComponent("GameManager").takeDamage();

		this.start_attack();
	},

	isPosFree(pos) 
	{
//	console.log("Num children: " + this.track.children.length);
//	console.log(this.track);
		for (var i=0; i<this.track.children.length; i++) 
		{
			var target = this.track.children[i];
			if ((target != this.node) && (target.getComponent("Health"))) 
			{
				if (target.position.x < pos)
				{
					if ((target.position.x + target.getContentSize().width/2) >= (pos - (this.node.getContentSize().width/2)))
					{
						//console.log("Bumping into: " + target.getContentSize().width)
						//console.log(this);
						//console.log(target);
						return false;
					}
				}
			}
		}
		return true;
	},
	
    update (dt) {
		switch(this.state)
		{
			case EnAlienState.MoveForward:
				var diff = this.move_speed * dt;
				var oldpos = this.pos;
				if (this.isPosFree(this.pos - diff))
				{
					this.pos -= diff;
					if (this.pos <= this.left)
					{
						this.pos = this.left;
						this.start_attack();
					}
					this.node.position = cc.v2(this.pos, this.node.position.y);
				}
				break;
			case EnAlienState.Stunned:
				this.stun_time += dt;
				if (this.stun_time >= this.stun_speed)
				{
					this.state = EnAlienState.MoveForward; // continue left again!
					this.sprite.spriteFrame = this.image;
				}
				break;
			case EnAlienState.Attack:
				this.attack_time += dt;
				if (this.attack_time >= this.attack_speed)
				{
					this.state = EnAlienState.AttackCooldown;
					this.attack_time -= this.attack_speed;
					this.sprite.spriteFrame = this.image;
				}
				break;
			case EnAlienState.AttackCooldown:
				this.attack_time += dt;
				if (this.attack_time >= this.attack_cooldown)
				{
					this.attack_time -= this.attack_cooldown;
					this.attack();
				}
				break;
			case EnAlienState.Dying:
				this.dying_time += dt;
				if (this.dying_time >= 2.0)
				{
					cc.find("UI_Menu").getComponent("Menu").getScoringManager().addScore(50);

					// Dead for good!
					this.node.destroy();
				}
				break;
		}
	},

	took_damage(event)
	{
		//console.log("Took damage!");
		//console.log(event);
		this.state = EnAlienState.Stunned;
		this.stun_time = 0;
		this.sprite.spriteFrame = this.imageStunned;
	},

	died(event)
	{
		//console.log("Died!");
		//console.log(event);

		this.state = EnAlienState.Dying;
		this.sprite.spriteFrame = this.imageDying;
		this.dying_time = 0;
	},
	
	fire_at(event)
	{
		// Clicking on this alien causes the track to fire a bullet
		this.track.getComponent("FireBullet").fire_bullet();
		event.stopPropagation();
	}
});
