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
		// Version 1.4
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
				el.remove();
			};
			function updatePage(){
				if(attr.el){
					var cls = arguments[0];
					var txt = Array.prototype.shift.apply(arguments[1]);
					var opt = arguments[1]||{};
					if(opt.length > 0) opt = opt[opt.length-1];
					if(attr.visible.includes(cls)) opt.visible = true;
					if(opt.visible){
						var el = document.createElement('div');
						el.classList.add('message',cls);
						el.innerHTML = txt.replace(/\%c/g,"");
						el.style.display = (txt ? 'block' : 'none');
						attr.el.prepend(el);
						id = "default";
						if(opt.id){
							id = opt.id;
							el.setAttribute('id',opt.id);
						}
						ms[id] = setTimeout(function(){ el.remove(); },opt.fade||5000);
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

	function GEResults(parties){
		this.name = "GE Results";
		this.version = "1.0";

		let msg = new OI.logger(this.name+' v'+this.version,{el:document.getElementById('messages'),'visible':['info','warning','error']});
		let tr = document.querySelectorAll('table.results tr');
		let el = document.querySelector('.winner');
		let banner = {
			'el': el,
			'headline':el.querySelector('.headline'),
			'majority':el.querySelector('.majority'),
			'elected':el.querySelector('.elected')
		};
		let pcon24cd = banner.el.getAttribute('data-id');
		let previous = banner.el.getAttribute('data-previous');
		let candidates = {};
		let pid,interval;

		for(let r = 0; r < tr.length; r++){
			el = tr[r];
			pid = el.getAttribute('data-id');
			candidates[pid] = {
				'el':el,
				'bar':el.querySelector('.party-bar'),
				'party':el.querySelector('.party'),
				'percent':el.querySelector('.percent')
			};
		}

		this.checkResults = function(){
			let url = 'https://raw.githubusercontent.com/open-innovations/ge-2024/main/src/constituency/_data/results/'+pcon24cd+'.json';
			msg.info('<svg version="1.1" width="1em" height="1em" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.11601 0 0 .11601 -49.537 -39.959)"><path d="m610.92 896.12m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.83333s" repeatCount="indefinite" /></path><path d="m794.82 577.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.6666s" repeatCount="indefinite" /></path><path d="m1162.6 577.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.5s" repeatCount="indefinite" /></path><path d="m1346.5 896.12m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.3333s" repeatCount="indefinite" /></path><path d="m1162.6 1214.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="-0.1666s" repeatCount="indefinite" /></path><path d="m794.82 1214.6m183.9-106.17-183.9-106.17-183.9 106.17v212.35l183.9 106.17 183.9-106.17z" fill="black"><animate attributeName="opacity" values="1;0;0" keyTimes="0;0.7;1" dur="1s" begin="0s" repeatCount="indefinite" /></path></g></svg>',{'id':'load'});
			fetch(url,{cache: "no-store"}).then(response => {
				if(!response.ok) msg.error('Network response was not OK');
				return response.json();
			}).then(json => {
				this.results = json;
				this.update();
			}).catch(error => {
				msg.remove('load');
				msg.error('There has been a problem getting updates',{'fade':5000});
			});
			return this;
		};
		
		this.update = function(){
			let r, i, key, party, c1, c2, src, total, pc, w, v, pid, title, winner, mostvotes, headline, majority, bg;
			let results = this.results;
			
			const calculateMajority = (r) => {
				const allVotes = results.votes.toSorted((a, b) => b.votes - a.votes).map(x => x.votes);
				return allVotes[0] - allVotes[1];
			}
			majority = calculateMajority(results);
			c1 = {'bg':'#dfdfdf','colour':'black'};
			c2 = {'bg':'#dfdfdf','colour':'black'};

			total = results.total_votes || 0;
			mostvotes = 0;
			if (total == 0) {
				for (i = 0; i < results.votes.length; i++) {
					if (typeof results.votes[i].votes === "number" && results.votes[i].votes > 0) {
						total += results.votes[i].votes;
						if(results.votes[i].votes > mostvotes){
							mostvotes = results.votes[i].votes;
							winner = results.votes[i];
						}
					}
				}
			}

			for (i = 0; i < results.votes.length; i++) {
				r = results.votes[i];
				pid = r.person_id;
				party = r.party_key;
				c = parties[party].colour;
				v = r.votes || 0;
				if (total > 0) {
					w = (50 * v / total).toFixed(1);
					if(total > 10){
						pc = ''+(100 * v / total).toFixed(1) + "%";
						v = v.toLocaleString() + " votes";
					}else{
						majority = "";
						v = "";
					}
				} else {
					pc = "";
					w = "0";
					v = "";
					majority = "";
				}

				if(pid in candidates){
					title = r.person_name + " (" + r.party_name + ")" + (results.confirmed ? ' '+pc+(v ? "("+v+")" : v) : '');

					candidates[pid].el.setAttribute('title',title);
					candidates[pid].party.innerHTML = (party != "other" ? parties[party].pa : r.party_name);
					candidates[pid].bar.style.width = w + '%';
					candidates[pid].percent.innerHTML = (pc ? ' / <strong>'+pc+'</strong>' : '');

					if(winner && r.party_key==winner.party_key){
						c1 = { 'bg':parties[r.party_key].colour };
					}
				}else{
					msg.warning('No person with ID '+pid)
				}
			}

			if(previous) c2 = { 'bg': parties[previous].colour };

			c1.colour = OI.contrastColour(c1.bg);
			c2.colour = OI.contrastColour(c2.bg);

			headline = (winner && "party_key" in winner ? parties[winner.party_key].name : "Awaiting results");
			if(winner){
				headline += ' '+(previous == winner.party_key ? "HOLD":"GAIN");
				if(!results.confirmed) headline += ' / provisional';
			}

			bg = 'linear-gradient(100deg, '+c1.bg+' 0%, '+c1.bg+' 95%, white 95%, white 96%, '+c2.bg+' 96%)';
			banner.el.style.backgroundImage = bg;
			banner.el.style.color = c1.colour;
			banner.headline.innerHTML = headline;
			banner.elected.innerHTML = (winner && winner.person_name ? 'Elected: <strong>'+winner.person_name+'</strong>' : '');
			banner.majority.innerHTML = (majority && results.confirmed ? 'Majority: <strong>'+majority+'</strong>' : '');

			let dstr = "";
			let date;

			if(results.declaration_time){
				if(!results.declaration_date) results.declaration_date = "2024-07-05";
				date = new Date(results.declaration_date + "T" + results.declaration_time + "Z");
				dstr = "Declared: "+formatDateTime(date);
				// Cancel updating
				clearInterval(interval);
				msg.log("Updating is paused")
			}else{
				if(results.last_updated){
					date = new Date(results.last_updated);
				}else{
					date = new Date();
				}
				dstr = ""+formatDateTime(date);
			}

			document.getElementById('lastupdate').querySelector('span').innerHTML = dstr;

			msg.remove('load');

			return this;
		};
		
		if(pcon24cd){
			let _obj = this;
			let now = new Date();
			// Only check regularly before the end of Friday 
			if(now < new Date("2024-07-05T23:00+0100")){
				interval = setInterval(function(){ _obj.checkResults() },60000);
				setTimeout(function(){ _obj.checkResults() },3000);
			}
		}else{
			msg.error('No PCON24CD provided',{'fade':10000});
		}

		return this;
	}

	let result = new GEResults(parties);

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
