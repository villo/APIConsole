/*
 * API console management: 
 */
villo.extend({
	console: {
		version: "0.9.9",
		jqconsole: null,
		edit: false,
		actions: {
			/*
			 * Help Function:
			 */
			"help": {
				run: function(){
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
			//TODO: splice out first word
			if(this.actions[functionName]){
				var action = this.actions[functionName];
				if(typeof(action) === "string"){
					//Redirect to another function
					action = this.actions[this.actions[functionName]];
				}
				if(action && action.run && typeof(action.run) === "function"){
					action.run();
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
		},
		write: function(wstring){
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
});