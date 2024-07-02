import { Colour } from "https://deno.land/x/oi_lume_viz@v0.15.6/lib/colour/colour.ts";

export default function ({ results, parties, thumbnails, tag }: Lume.Data) {
	let pts = Object.keys(parties);
	let html = '<table class="results"><tbody>';
	let r,i,key,party,c,src,total,pc,w,v;
	
	if(typeof thumbnails==="undefined") thumbnails = {};
	
	total = (results.total_votes||0);
	if(total==0){
		for(i = 0; i < results.votes.length; i++){
			if(typeof results.votes[i].votes==="number" && results.votes[i].votes > 0){
				total += results.votes[i].votes;
			}
		}
	}

	for(i = 0; i < results.votes.length; i++){
		r = results.votes[i];
		party = r.party_key;
		key = pts.includes(party) ? party : "other";
		c = Colour(key);
		v = (r.votes||0);
		if(total > 0){
			pc = (100 * v / total).toFixed(1) + '%';
			w = (80 * v / total).toFixed(1);
			v = v.toLocaleString() + ' votes';
		}else{
			pc = "TBA";
			w = "0";
			v = "";
		}
		
		html += '<tr title="'+r.person_name+' ('+r.party_name+'): ' + v + (v ? '(' + pc + ')' : pc) + '" data-party="' + r.party_key + '">';
		html += '<td>';
		src = "/assets/images/missing.svg";
		if(typeof thumbnails[r.person_id]==="string"){
			src = thumbnails[r.person_id]; // r.image
		}
		html += '<a href="https://whocanivotefor.co.uk/person/' + r.person_id + '/" title="' + r.person_name + '"><img src="' + src + '" alt="Photograph of ' + r.person_name + '"/></a>';
		html += '</td>';
		html += '<td>';
		html += '<span class="party-bar" style="width:' + w + '%;background:' + c.hex + ';color:' + c.contrast + ';"></span>';
		html += '<span class="candidate">' + r.person_name + '</span>'
		html += ' / <span class="party">' + parties[r.party_key].pa + '</span><br />';
		html += ' <strong class="percent">' + pc + '</strong>';
		html += '</td>';
		html += '</tr>'
	}
	html += '</table>';
	return html;
}
