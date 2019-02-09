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
		BeerBottleLiquid: { default: null, type: cc.Node },
		
		PlantCount: 2,
		Score: 0,
		MaxClickDistance: 50,
		SetsRequired: 5,
    },

    // LIFE-CYCLE CALLBACKS:
    ctor: function () {
        this.SelectedTokens = [];
		this.IsEffectActive = false;
		this.NewPlantList = [];
    },


	lastToken: null,
	SetsCompleted: 0,
	
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

    start () 
	{
		this.SolutionPaths = this.CalcSolutionPaths();
		this.SetsCompleted = 0;
		this.UpdateScore();
		this.ResetBoard();
		
		// Make sure there is at least one solution at the start
		while (!this.CheckForAnySets())
		{
			this.ResetBoard();
		}
    },

	AreAnyPlotsAvailable()
	{
		for (var i=0; i<this.Tokens.length; i++)
		{
			var token = this.Tokens[i];
			if (token.spriteFrame == this.PickedType)
			{
				// At least one plot found to fill
				return true;
			}
		}
		// No plots found
		return false;
	},
	
	EndGame()
	{
		// Out of solutions! End game
		this.IsEffectActive = true;
		// Pause a second, then go on
		setTimeout(function() {this.EndGameAfterPause();}.bind(this), 500);
	},
	
	EndGameAfterPause()
	{
		this.ShrinkAllPlants();
		// Pause another second, then go on
		setTimeout(function() {this.EndGameAfterPause2();}.bind(this), 500);
	},
	
	EndGameAfterPause2()
	{
		if ((typeof window.GlobalData !== 'undefined') && (typeof window.GlobalData.Score !== 'undefined'))
		{
			window.GlobalData.Score = this.Score;
		}
		if (typeof FBInstant !== 'undefined') 
		{
			FBInstant.getLeaderboardAsync("TopScores").then
			(
				leaderboard => 
				{
					console.log("retrieved leaderboard: " + leaderboard.getName());
					return leaderboard.setScoreAsync(this.Score);
				}
			)
			.then
			(
				() => {
					console.log("Score saved: " + this.Score);
					this.GotoHighScores();
				}
			)
			.catch
			(
				error => 
				{ 
					console.error(error);
					this.GotoMainScene();
				}
			)
		}
		else
		{
			this.GotoHighScores();
		}
	},
	
	GotoMainScene()
	{
		cc.director.loadScene("MainScene");
	},
	
	GotoHighScores()
	{
		cc.director.loadScene("HighScores");
	},
	
	PlantPressed()
	{
		if ((this.PlantCount > 0) && (this.AreAnyPlotsAvailable()))
		{
			this.PlantCount--;
			this.UpdatePlantCount();
			this.PlantNewPlants();

			// Did these new plants cause no solutions to be available?
			if ((!this.CheckForAnySets()) && (this.PlantCount == 0))
			{
				this.EndGame();
			}
		}
		else if (this.PlantCount > 0)
		{
			// No spots available, replant fully
			// Full replant!
			for (var i=0; i<this.Tokens.length; i++)
			{
				var token = this.Tokens[i];
				token.spriteFrame = this.PickedType;
			}
			this.PlantCount--;
			this.UpdatePlantCount();
			this.PlantNewPlants();

			// Did these new plants cause no solutions to be available?
			if ((!this.CheckForAnySets()) && (this.PlantCount == 0))
			{
				this.EndGame();
			}
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

	ResetBeer()
	{
		this.SetsCompleted = 0;
		var liquid = this.BeerBottleLiquid;
		liquid.scale = cc.v2(1, 0);
		var ratio = ((this.SetsRequired - this.SetsCompleted) / this.SetsRequired);
		liquid.runAction(new cc.scaleTo(0.5, 1, ratio));
	},
	
	ResetBoard()
	{
		for (var i=0; i<this.Tokens.length; i++)
		{
			var token = this.Tokens[i];
			token.spriteFrame = this.PickedType;
		}
		this.PlantNewPlants();
		
		this.ResetBeer();
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
		if ((token != null) && (this.IsAdjacentTokenToLast(token)) && (token.spriteFrame != this.PickedType))
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
		if (!this.IsEffectActive)
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
		if (!this.IsEffectActive)
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
	
	ShakeSelected()
	{
		for (var i=0; i<this.SelectedTokens.length; i++)
		{
			var token = this.SelectedTokens[i];
			var pos = token.node.position;
			token.node.position = cc.v2(pos.x-10, pos.y);
			var posEnd = pos;
			var action = new cc.moveTo(0.2, posEnd);
			action.easing(cc.easeBackInOut(0.1));
			token.node.runAction(action);
		}
	},
	
	IsValidSetSelected()
	{
		// Must have 4 tokens!
		if (this.SelectedTokens.length != 4)
		{
			return false;
		}
		var found = [false, false, false, false];
		var foundCount = 0;
		for (var i=0; i<4; i++)
		{
			var token = this.SelectedTokens[i];
			for (var j=0; j<4; j++)
			{
				if ((token.spriteFrame == this.IngredientTypes[j]) && (found[j] == false))
				{
					found[j] = true;
					foundCount++;
				}
			}
		}
		if (foundCount == 4)
		{
			// Found 4 different types, cool, that's a match
			return true;
		}

		// Something other, bad
		return false;
	},
	
	PickSelectedPlants()
	{
		for (var i=0; i<this.SelectedTokens.length; i++)
		{
			var token = this.SelectedTokens[i];
			token.spriteFrame = this.PickedType;
		}
	},
	
	BeerCompleted()
	{
		this.SetsCompleted = 0;
		//this.ResetBoard();
		this.ResetBeer();
		this.PlantCount += 2;
		this.UpdatePlantCount();
	},
	
	DrinkBeer()
	{
		// TBD
		this.SetsCompleted++;
		if (this.SetsCompleted >= this.SetsRequired)
		{
			this.BeerCompleted();
		}
		else
		{
			var liquid = this.BeerBottleLiquid;
			var ratio = ((this.SetsRequired - this.SetsCompleted) / this.SetsRequired);
			liquid.runAction(new cc.scaleTo(0.5, 1, ratio));
		}
	},
	
	ScorePoints(NumberPoints)
	{
		this.Score += NumberPoints;
		this.UpdateScore();
	},
	
	GridDragEnd(xy)
	{
		if (!this.IsEffectActive)
		{
			//console.log("Drag end.");
			// Do we have a valid set?
			if (this.IsValidSetSelected())
			{
				// No shake
				// Replace chosen with picked
				this.PickSelectedPlants();
				this.ClearSelected();
				this.DrinkBeer();
				this.ScorePoints(1);
				
				// That move was good, but are we out moves?  This
				// occurs if we can no longer plant AND there are no
				// more sets on the board.
				if ((this.PlantCount==0) && (!this.CheckForAnySets()))
				{
					this.EndGame();
				}
			}
			else
			{
				this.ShakeSelected();
				this.ClearSelected();
			}
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
				token.node.scale = cc.v2(0.1, 0.1);
				token.node.runAction(new cc.scaleTo(0.5, 1));
				this.NewPlantList.push(token);
			}
		}
	},

	CalcSolutionPaths()
	{
		var results = [];
		
		var p0, p1, p2, p3;
		var dirs = [-1, 1, -5, 5];
		var spots = [0, 0, 0, 0];
		for (var i=0; i<25; i++)
		{
			spots[0] = i;
			p0 = i;
			for (var j=0; j<4; j++)
			{
				p1 = p0 + dirs[j];
				spots[1] = p1;
				for (var k=0; k<4; k++)
				{
					p2 = p1 + dirs[k];
					spots[2] = p2;
					for (var m=0; m<4; m++)
					{
						p3 = p2 + dirs[m];
						spots[3] = p3;
						
						// Is this a valid position?
						var valid = true;
						for (var n=0; n<4; n++)
						{
							// Invalid if the spot is off the board
							if ((spots[n] < 0) || (spots[n] >= 25))
							{
								// Went off the board, e.g. [3, 2, -3, -4] <-- both -3 and -4 are off the board
								valid = false;
							}
							// Invalid if the spot is repeated
							for (var q=n+1; q<4; q++)
							{
								if (spots[n] == spots[q])
								{
									// Repeated a spot (e.g. [2, 3, 2, 1] <-- two 2's
									valid = false;
								}
							}
							// Invalid if the wrap around off the edge
							if (n > 0) 
							{
								// Check for spots going left/right
								if ((spots[n] == spots[n-1]+1) || (spots[n] == spots[n-1]-1))
								{
									if (Math.floor(spots[n]/5) != Math.floor(spots[n-1]/5))
									{
										// Wrapped around from one row to another (e.g. 4 -> 5, 5 -> 4 <-- 5 is row 1 left, 4 is row 0 right)
										valid = false;
									}
								}
							}
						}
						if (valid)
						{
							results.push(spots.slice());
						}
					}
				}
			}
		}
		return results;
	},
	
	CheckForAnySets()
	{
		for (var n=0; n<this.SolutionPaths.length; n++)
		{
			var Path = this.SolutionPaths[n];
			var Types = [false, false, false, false];
			var NumTypesFound = 0;
			for (var i=0; i<4; i++)
			{
				var Token = this.Tokens[Path[i]];
				for (var j=0; j<4; j++)
				{
					if (Token.spriteFrame == this.IngredientTypes[j])
					{
						if (Types[j] == false)
						{
							Types[j] = true;
							NumTypesFound++;
						}
					}
				}
				// If we found one set of 4 different ingredients, we are
				// done and have at least one possible solution on the board
				if (NumTypesFound == 4)
				{
					return true;
				}
			}
		}
		// Checked all paths (over 400 of them!) for a set. Never found one.
		return false;
	},
	
	ShrinkAllPlants()
	{
		for (var i=0; i<25; i++)
		{
			var token = this.Tokens[i];
			if (token.spriteFrame != this.PickedType)
			{
				token.node.scale = cc.v2(1, 1);
				token.node.runAction(new cc.scaleTo(0.5, 0.0));
			}
		}
	},


    // update (dt) {},
});
