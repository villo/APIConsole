/*
 * API console management: 
 */
(function(){
	var extension = {
		console: {
			version: "0.9.9",
			jqconsole: null,
			edit: false,
			lastOutput: "",
			documentation: null,
			actions: {
				/*
				 * Help Function:
				 */
				"help": {
					run: function(){
						villo.console.write(
							"\nHere are some helpful commands: \n"+
							"   - help  -  What you're looking at right now.\n"+
							"   - doc villo.ajax  -  Retrieves the documentation for any given villo function. Simply replace \"villo.ajax\" with any	documented function. \n"+
							"   - cls  -  Clears all of the content currently displayed in the console.\n"+
							"   - Ctrl+E  -  Puts the console into \"Edit Mode\", which is designed for multi-line code.\n"+
							"Any other input to the console will be interpreted and run as JavaScript.\n"
						);
						return true;
					}
				},
				/*
				 * Clear Screen:
				 */
				"cls": {
					run: function(){
						villo.console.jqconsole.Reset();
						villo.console.startPrompt();
					}
				},
				"clear": "cls",
				"clearscreen": "cls",
				/*
				 * Documentation:
				 */
				"doc": {
					run: function(){
						return true;
					}
				},
				"docs": "doc",
				"documentation": "doc"
			},
			run: function(functionName){
				//Don't run empty commands: 
				if(functionName.replace(/ /g,'') !== ""){
					var splitDemand = functionName.split(" ");
					if(this.actions[splitDemand[0].toLowerCase()]){
						var action = this.actions[splitDemand[0].toLowerCase()];
						if(typeof(action) === "string"){
							//Redirect to another function
							action = this.actions[this.actions[splitDemand[0].toLowerCase()]];
						}
						if(action && action.run && typeof(action.run) === "function"){
							action.run(splitDemand);
						}else{
							this.write("Undefined error occured.");
						}
					}else{
						//run as javascript
						try{
							this.write(this.inspect(eval.call(null, functionName)));
						}catch(e){
							this.write(e);
						};
					}
				}
			},
			write: function(wstring){
				this.lastOutput = JSON.stringify(wstring);
				//If type is an object, cycle through level one, and display all of the properties and the type.
				this.jqconsole.Write(wstring + "\n", 'jqconsole-output');
			},
			inspect: function(ins){
				//Do some parsing:
				if(typeof(ins) === "object"){
					return JSON.stringify(ins);
				}else{
					return ins;
				}
				//This method prevents a lot of circular stringify problems, but is very limited:
				/*
				if(typeof(ins) === "object"){
					var returnString = "";
					//jQuery foreach:
					$.each(ins, function(key, value) {
						returnString += ('"' + key + '" (' + typeof(value) + ') \n');
					});
					return returnString;
				}else{
					return ins;
				}
				*/
			}
		}
	};
	
	/*
	 * Compatability test. This ensures that the extension will work in older version of Villo:
	 */
	var test = {};
	//Villo 0.9.7 extends the object prototype with the extend function:
	if(test.extend && typeof(test.extend) === "function"){
		//0.9.7
		villo.extend(extension);
	}else{
		//0.9.9+
		villo.extend(villo, extension);
	}
})();
