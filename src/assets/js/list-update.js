(function(root){

	if(!root.OI) root.OI = {};
	if(!root.OI.ready){
		root.OI.ready = function(fn){
			// Version 1.1
			if(document.readyState != 'loading') fn();
			else document.addEventListener('DOMContentLoaded', fn);
		};
	}

})(window || this);

/*
	Open Innovations Contrasting colour
*/
(function(root){

	// Convert to sRGB colorspace
	// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	function sRGBToLinear(v){
		v /= 255;
		if (v <= 0.03928) return v/12.92;
		else return Math.pow((v+0.055)/1.055,2.4);
	}
	function h2d(h) {return parseInt(h,16);}
	// https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	function relativeLuminance(rgb){ return 0.2126 * sRGBToLinear(rgb[0]) + 0.7152 * sRGBToLinear(rgb[1]) + 0.0722 * sRGBToLinear(rgb[2]); }
	// https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#contrast-ratiodef
	function contrastRatio(a, b){
		var L1 = relativeLuminance(a);
		var L2 = relativeLuminance(b);
		if(L1 < L2){
			var temp = L2;
			L2 = L1;
			L1 = temp;
		}
		return (L1 + 0.05) / (L2 + 0.05);
	}	
	function contrastColour(c){
		var rgb = [];
		if(c.indexOf('#')==0){
			rgb = [h2d(c.substring(1,3)),h2d(c.substring(3,5)),h2d(c.substring(5,7))];
		}else if(c.indexOf('rgb')==0){
			var bits = c.match(/[0-9\.]+/g);
			if(bits.length == 4) this.alpha = parseFloat(bits[3]);
			rgb = [parseInt(bits[0]),parseInt(bits[1]),parseInt(bits[2])];
		}
		var cols = {
			"black": [0, 0, 0],
			"white": [255, 255, 255],
		};
		var maxRatio = 0;
		var contrast = "white";
		for(var col in cols){
			var contr = contrastRatio(rgb, cols[col]);
			if(contr > maxRatio){
				maxRatio = contr;
				contrast = col;
			}
		}
		if(maxRatio < 4.5){
			console.warn('Text contrast poor ('+maxRatio.toFixed(1)+') for %c'+c+'%c','background:'+c+';color:'+contrast,'background:none;color:inherit;');
		}else if(maxRatio < 7){
			//console.warn('Text contrast good ('+maxRatio.toFixed(1)+') for %c'+c+'%c','background:'+c+';color:'+contrast,'background:none;color:inherit;');
		}
		return contrast;
	}
	root.OI.contrastColour = contrastColour;

})(window || this);

OI.ready(function(){

	if(!OI.logger){
		// Version 1.4.1
		OI.logger = function(title,attr){
			if(!attr) attr = {};
			title = title||"OI Logger";
			var ms = {};
			this.logging = (location.search.indexOf('debug=true') >= 0);
			if(console && typeof console.log==="function"){
				this.log = function(){ if(this.logging){ console.log.apply(null,getParam(arguments)); updatePage('log',arguments); } };
				this.info = function(){ console.info.apply(null,getParam(arguments)); updatePage('info',arguments); };
				this.warn = function(){ console.warn.apply(null,getParam(arguments)); updatePage('warning',arguments); };
				this.error = function(){ console.error.apply(null,getParam(arguments)); updatePage('error',arguments); };
			}
			this.remove = function(id){
				var el = attr.el.querySelector('#'+id);
				if(ms[id]) clearTimeout(ms[id]);
				if(el) el.remove();
			};
			function updatePage(){
				if(attr.el){
					var cls = arguments[0];
					var txt = Array.prototype.shift.apply(arguments[1]);
					var opt = arguments[1]||{};
					if(opt.length > 0) opt = opt[opt.length-1];
					if(attr.visible.includes(cls)) opt.visible = true;
					if(opt.visible){
						var id = "default";
						if(opt.id) id = opt.id;
						// Get an existing element
						var el = attr.el.querySelector('#'+id);
						if(!el){
							// Create the element
							el = document.createElement('div');
							el.classList.add('message',cls);
							attr.el.prepend(el);
							el.setAttribute('id',opt.id);
						}
						el.innerHTML = txt.replace(/\%c/g,"");
						el.style.display = (txt ? 'inline-block' : 'none');
						if(typeof opt.fade==="number"){
							ms[id] = setTimeout(function(){ el.remove(); },opt.fade);
						}
					}
				}
			}
			function getParam(){
				var a = Array.prototype.slice.call(arguments[0], 0);
				var str = (typeof a[0]==="string" ? a[0] : "");
				// Build basic result
				var ext = ['%c'+title+'%c: '+str.replace(/<[^\>]*>/g,""),'font-weight:bold;',''];
				var n = (str ? 1 : 0);
				// If there are extra parameters passed we add them
				return (a.length > n) ? ext.concat(a.splice(n)) : ext;
			}
			return this;
		};
	}

	function GEListResults(el,parties){
		this.name = "GE List Results";
		this.version = "1.0";
		let loader = '<svg version="1.1" width="1em" height="1em" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.11601 0 0 .11601 -49.537 -39.959)"><path d="m610.92 896.12m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.83333s" repeatCount="indefinite" /></path><path d="m794.82 577.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.6666s" repeatCount="indefinite" /></path><path d="m1162.6 577.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.5s" repeatCount="indefinite" /></path><path d="m1346.5 896.12m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.3333s" repeatCount="indefinite" /></path><path d="m1162.6 1214.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.1666s" repeatCount="indefinite" /></path><path d="m794.82 1214.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="0s" repeatCount="indefinite" /></path></g></svg>';
		let msg = new OI.logger(this.name+' v'+this.version,{el:document.getElementById('messages'),'visible':['info','warning','error']});
		let cons = el.querySelectorAll('li .winner');
		let interval;
		let _obj = this;

		// Build a lookup for rows
		let rows = {};
		for(let c = 0; c < cons.length; c++){
			let cid = cons[c].getAttribute('data-id');
			rows[cid] = {'el':cons[c],'previous':cons[c].getAttribute('data-previous'),'headline':cons[c].querySelector('.headline')};
		}

		this.update = function(){
			if(typeof this.results!=="object"){
				msg.error("Poorly formatted results",{'fade':10000});
				return this;
			}
			let confirmed = 0;
			for(let i = 0; i < this.results.length; i++){
				let pid = this.results[i].id||"";
				let pty = this.results[i].p||"";
				if(this.results[i].c) confirmed++;
				if(pid && pid in rows){
					// Update colours
					let c1 = (rows[pid].previous in parties ? parties[rows[pid].previous].colour : '#dfdfdf');
					let c2 = (pty in parties ? parties[pty].colour : '#dfdfdf');
					bg = 'linear-gradient(100deg, '+c1+' 0%, '+c1+' 95%, white 95%, white 96%, '+c2+' 96%)';
					rows[pid].el.style.backgroundImage = bg;
					rows[pid].el.style.color = OI.contrastColour(c1);
					// Update text
					rows[pid].headline.innerHTML = (pty in parties ? parties[pty].pa : pty) + " " + (rows[pid].previous==pty ? "HOLD":"GAIN") + (this.results[i].c ? "":" / provisional");

				}else{
					console.warn('Bad constituency code '+this.results[i].id);
				}
			}

			if(confirmed==650){
				msg.info("All results are confirmed",{'id':'official'});
				// Cancel updating
				clearInterval(interval);
			}else{
				msg.info(this.results.length+" of 650 reported",{'id':'official'});
			}

			let dstr = "";
			let date = new Date();
			dstr = ""+formatDateTime(date);
			document.getElementById('lastupdate').querySelector('span').innerHTML = dstr;

			return this;
		};

		this.checkResults = function(){
			//let url = 'https://ge2024.hexmap.uk/results.json';
			let url = 'https://open-innovations.org/projects/ge2024/results.json';
			msg.info('Checking for updates '+loader,{'id':'load'});
			fetch(url,{cache: "no-store"}).then(response => {
				if(!response.ok) msg.error('Cannot auto-update');
				return response.json();
			}).then(json => {
				this.results = json;
				this.update();
				msg.remove('load');
			}).catch(error => {
				msg.remove('load');
				msg.error('Failed to update.',{'fade':5000});
			});
			return this;
		};

		this.init = function(){
			msg.log('init');
			let date = new Date();

			if(date < new Date("2024-07-04T00:00+0100")){
				if(interval) clearInterval(interval);
				interval = setInterval(function(){ _obj.checkResults() },60000);
				this.checkResults();
			}else if(date < new Date("2024-07-04T07:00+0100")){
				msg.info("Polling not open",{'id':'official'});
				if(!interval) interval = setInterval(function(){ _obj.init() },10000);
			}else if(date < new Date("2024-07-04T22:00+0100")){
				msg.info("Polls open",{'id':'official'});
				if(!interval) interval = setInterval(function(){ _obj.init() },10000);
			}else{
				if(interval) clearInterval(interval);
				interval = setInterval(function(){ _obj.checkResults() },60000);
				this.checkResults();
			}

			return this;
		};

		//setTimeout(function(){ _obj.init() },2000);
		//this.checkResults();
		this.init();

		return this;
	}


	let result = new GEListResults(document.getElementById('constituency-list'),parties);

	function formatDateTime(date){
		const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		let y = date.getFullYear();
		let m = date.getUTCMonth();
		let d = date.getUTCDate();
		let hh = (date.getUTCHours() + 1);	// Force BST in case people have privacy set
		let mm = date.getMinutes();
		if(hh >= 24){
			hh -= 24;
			d++;
		}
		const nth = (d>3&&d<21?"th":d%10==1?"st":d%10==2?"nd":d%10==3?"rd":"th");
		return (hh%12)+":"+(mm < 10 ? "0":"")+mm+(hh< 12 ? "am":"pm")+' on '+d+nth+" "+month[m];
	}
});
