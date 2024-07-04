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

	function GEHexmapResults(el,parties){
		this.name = "GE Hexmap Results";
		this.version = "1.0";
		let loader = '<svg version="1.1" width="1em" height="1em" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.11601 0 0 .11601 -49.537 -39.959)"><path d="m610.92 896.12m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.83333s" repeatCount="indefinite" /></path><path d="m794.82 577.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.6666s" repeatCount="indefinite" /></path><path d="m1162.6 577.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.5s" repeatCount="indefinite" /></path><path d="m1346.5 896.12m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.3333s" repeatCount="indefinite" /></path><path d="m1162.6 1214.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.1666s" repeatCount="indefinite" /></path><path d="m794.82 1214.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="0s" repeatCount="indefinite" /></path></g></svg>';
		let msg = new OI.logger(this.name+' v'+this.version,{el:document.getElementById('messages'),'visible':['info','warning','error']});
		let hs = el.querySelectorAll('.data-layer .hex');
		let interval;
		let _obj = this;
		// Build a lookup for hexes
		let hexes = {};
		for(let h = 0; h < hs.length; h++){
			hid = hs[h].getAttribute('data-id');
			hexes[hid] = {'el':hs[h],'path':hs[h].querySelector('path'),'title':hs[h].querySelector('title').innerHTML.replace(/<[^\>]+>/g,'')};
		}
		let legend = el.querySelector('.oi-legend-items');

		this.update = function(){
			let confirmed = 0;
			let gotresult = 0;
			if(typeof this.results!=="object"){
				msg.error("Poorly formatted results",{'fade':10000});
				return this;
			}
			let dat = {};
			for(let i = 0; i < this.results.length; i++){
				let pid = this.results[i].id||"";
				let pty = this.results[i].p||"";
				if(pid && pid in hexes){
					let colour = (pty in parties ? parties[pty].colour : '#dfdfdf');
					hexes[pid].path.setAttribute('fill',colour);
					dat[pid] = hexes[pid].title + ' ('+parties[pty].pa+')';
				}else{
					console.warn('Bad constituency code '+this.results[i].id);
				}
				if(this.results[i].c) confirmed++;
			}

			// Build legend and replace the existing one
			let items = buildLegend(this.results,"p","party_name",{ "speaker":"speaker" },parties);
			let str = "";
			for(let i = items.length-1; i >= 0; i--){
				str += '<div class="oi-legend-item" data-series="'+i+'"><i class="oi-legend-icon" style="background:'+items[i].colour+'"></i><span class="oi-legend-label">'+items[i].label+'</span></div>';
			}
			legend.innerHTML = str;

			// Update map filter
			let filter = el.querySelector('.oi-filter');
			if(filter){
				let fid = filter.getAttribute('data-id');
				filter = OI.FilterMap.get(fid);
				filter.updateData(dat);
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
			let checker;
			let date = new Date();

			if(date < new Date("2024-07-04T17:00+0100")){
				if(interval) clearInterval(interval);
				interval = setInterval(function(){ _obj.checkResults() },60000);
				this.checkResults();
			}else if(date < new Date("2024-07-04T22:00+0100")){
				msg.info("Polls still open",{'id':'official'});
				if(!interval) interval = setInterval(function(){ _obj.init() },10000);
			}else{
				if(interval) clearInterval(interval);
				interval = setInterval(function(){ _obj.checkResults() },60000);
				this.checkResults();
			}

			return this;
		};

		//setTimeout(function(){ _obj.init() },2000);
		this.init();

		return this;
	}


	let result = new GEHexmapResults(document.getElementById('ge2024'),parties);

	function buildLegend(data, column, labelcol, labels = {}, parties) {

		const lookup = {};
		for (let r = 0; r < data.length; r++) {
			const v = data[r][column];
			if (v) {
				if (!lookup[v]) lookup[v] = { "count": 0, "label": v };
				lookup[v].count++;
				if (labelcol && labelcol in data[r]) lookup[v].label = data[r][labelcol];
			}
		}

		const legend = [];
		for (const party in lookup) {
			let lbl = lookup[party].label;
			let colour = "#dfdfdf";
			if (lbl in labels) lbl = labels[lbl];
			if (party in labels) lbl = labels[party];
			if (party in parties){
				lbl = parties[party].pa;
				colour = parties[party].colour;
			}else console.warn("No match for " + lbl + " (" + party + ")");
			legend.push({
				"colour": colour,
				"count": lookup[party].count,
				"label": lbl + ": " + lookup[party].count,
			});
		}

		legend.sort(function (a, b) {
			if (a.colour == "Spk") return -1;
			if (b.colour == "Spk") return 1;
			// Sort by count
			if (a.count - b.count != 0) return (a.count - b.count);
			// Fall back to sorting by label
			return (a.label.toLowerCase() < b.label.toLowerCase() ? 1 : -1);
		});

		return legend;
	}
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
		return d+nth+" "+month[m]+" "+y+" at "+hh+":"+(mm < 10 ? "0":"")+mm+(hh==0 ? " midnight":(hh< 12 ? " am":" pm"))+" BST";
	}
});
