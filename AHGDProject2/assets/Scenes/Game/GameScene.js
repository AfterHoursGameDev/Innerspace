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
		// Links
		ScoreObj: { default: null, type: cc.Label },
		PlantCountObj: { default: null, type: cc.Label },
		Tokens: { default: [], type: cc.Sprite },
		IngredientTypes: { default: [], type: cc.SpriteFrame },
		PickedType: { default: null, type: cc.SpriteFrame },
		
		PlantCount: 2,
		Score: 0,
		MaxClickDistance: 50,
    },

    // LIFE-CYCLE CALLBACKS:
    ctor: function () {
        this.SelectedTokens = [];
		this.EffectType = null;
		this.EffectTime = 0.0;
		this.NewPlantList = [];
    },


	lastToken: null,
	
	onLoad : function()
	{
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
            this.GridClicked(event.getLocation());
			event.propagate = false;
			return true;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
            this.GridDragged(event.getLocation());
			event.propagate = false;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
            this.GridDragEnd(event.getLocation());
			event.propagate = false;
        }, this);
    },

    start () {
		this.UpdateScore();
    },

	PlantPressed()
	{
		if (this.PlantCount > 0)
		{
			this.PlantCount--;
			this.UpdatePlantCount();
			this.PlantNewPlants();
		}
		else
		{
			// Nothing happens, zero count
		}
	},
	
	UpdateScore() 
	{
		this.ScoreObj.string = this.Score;
	},
	
	UpdatePlantCount()
	{
		this.PlantCountObj.string = "x" + this.PlantCount;
	},
	
	IsSelected(token)
	{
		// Nulls are not selected
		if (token == null)
		{
			return false;
		}

		// Check if token is in the list
		for (var i=0; i<this.SelectedTokens.length; i++)
		{
			if (token == this.SelectedTokens[i])
			{
				return true;
			}
		}
		return false;
	},
	
	ClearSelected()
	{
		for (var i=0; i<this.SelectedTokens.length; i++)
		{
			var pos = this.SelectedTokens[i].node.position;
			pos.x -= 5;
			pos.y += 5;
			this.SelectedTokens[i].node.position = pos;
		}
		this.SelectedTokens = [];
		this.lastToken = null;
	},
	
	SelectToken(token)
	{
		if ((token != null) && (this.IsAdjacentTokenToLast(token)))
		{
			this.SelectedTokens.push(token);
			this.lastToken = token;
			var pos = token.node.position;
			pos.x += 5;
			pos.y -= 5;
			token.node.position = pos;
		}
	},
	
	IsAdjacentTokenToLast(token)
	{
		if (this.lastToken == null)
		{
			// No last token, so always considered adjacent
			return true;
		}
		var diffX, diffY;
		var pos = token.node.convertToWorldSpaceAR(cc.v2(0,0));
		var posLast = this.lastToken.node.convertToWorldSpaceAR(cc.v2(0,0));
		diffX = Math.abs(posLast.x - pos.x);
		diffY = Math.abs(posLast.y - pos.y);
		//console.log("diffX=" + diffX + ", diffY=" + diffY);
		// Along X axis?
		if ((diffX < 10) && (diffY < 150))
		{
			return true;
		}
		// Along Y axis?
		if ((diffX < 150) && (diffY < 10))
		{
			return true;
		}
		return false;
	},
	
	GridClicked(xy)
	{
		if (this.EffectType == null)
		{
			//console.log("x=" + xy.x + ", y=" + xy.y);
			var closest = this.FindClosestToken(xy);
			if (!this.IsSelected(closest))
			{
				if (closest == null)
				{
					//console.log("Nothing close!");
				}
				else
				{
					//console.log("Closest: " + closest.name);
				}
				this.SelectToken(closest);
			}
		}
	},
	
	GridDragged(xy)
	{
		if (this.EffectType == null)
		{
			//console.log("x=" + xy.x + ", y=" + xy.y);
			var closest = this.FindClosestToken(xy);
			if (!this.IsSelected(closest))
			{
				if (closest == null)
				{
					//console.log("Nothing close to drag!");
				}
				else
				{
					//console.log("Closest drag: " + closest.name);
				}
				this.SelectToken(closest);
			}
		}
	},
	
	GridDragEnd(xy)
	{
		if (this.EffectType == null)
		{
			//console.log("Drag end.");
			this.ClearSelected();
		}
	},
	
	FindClosestToken(xy)
	{
		var closest = null;
		var closestDistance = this.MaxClickDistance * this.MaxClickDistance;
		var i;
		
		for (i=0; i<25; i++)
		{
			var distance;
			var pos = this.Tokens[i].node.convertToWorldSpaceAR(cc.v2(0,0));
			//console.log(i + ") " + pos);
			distance = ((xy.x - pos.x) * (xy.x - pos.x)) + ((xy.y - pos.y) * (xy.y - pos.y));
			if (distance < closestDistance)
			{
				closestDistance = distance;
				closest = this.Tokens[i];
			}
		}
		return closest;
	},
	
	PlantNewPlants()
	{
		this.NewPlantList = [];
		for (var i=0; i<25; i++)
		{
			var token = this.Tokens[i];
			if (token.spriteFrame == this.PickedType)
			{
				token.spriteFrame = this.IngredientTypes[Math.floor(Math.random() * 4)];
				this.NewPlantList.push(token);
			}
		}
	},
	
    // update (dt) {},
});
