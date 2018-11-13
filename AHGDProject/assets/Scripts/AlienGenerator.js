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
		difficulty: 1,
		timeNext: 1,
		timeNextMin: 1,
		randomTimeNext: 2,
		maxAliens: 1,
		tracks: { type: cc.Node, default: null },
		alienType1: { default: null, type: cc.Node },
		id: 1,
    },
	
	timer: 0.0,

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
		this.timer = 0.0;
		this.id = 1;
    },

	countAliens()
	{
		var listTracks = this.tracks.children;
		var count = 0;
		for (var i=0; i<listTracks.length; i++)
		{
			var track = listTracks[i];
			for (var j=0; j<track.children.length; j++) {
				var target = track.children[j];
				if (target.getComponent("Health")) {
					count++;
				}
			}
		}
		return count;
	},
	
	generate()
	{
		var listTracks = this.tracks.children;

		// Generate an alien
		//console.log("Generate alien on:");
		var n = Math.floor(Math.random() * listTracks.length);
		var track = listTracks[n];
		//console.log(track);
		var alien = cc.instantiate(this.alienType1);
		//console.log(alien);
		track.addChild(alien, 0, "Alien" + this.id++);
//		alien.setParent(track);
		alien.getComponent("Alien").track = track;
        alien.position = cc.v2(track.width, 0);
		alien.active = true;
		//console.log(track);
	},
	
	timeToGenerate()
	{
		// Ready to generate an alien
		if (this.countAliens() < this.maxAliens)
		{
			// If everything is valid, generate
			this.generate();
		}
	},
	
    update (dt) 
	{
		this.timer += dt;
		if (this.timer >= this.timeNext)
		{
			this.timer -= this.timeNext;
			this.timeNext = this.timeNextMin + Math.random() * this.randomTimeNext;
			this.timeToGenerate();
		}
	},
});
