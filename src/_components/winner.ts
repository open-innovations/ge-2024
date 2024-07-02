import { Colour } from "https://deno.land/x/oi_lume_viz@v0.15.6/lib/colour/colour.ts";

export default function ({ winner, previous, results, parties, thumbnail }: Lume.Data, ) {
	const pts = Object.keys(parties);

	let party,key,pid,party_name,person_name,change,src,maj,name;
	let html = "";

	if(winner && 'party_key' in winner){
		party = winner.party_key;
		key = pts.includes(party) ? party : "other";
		pid = winner.person_id;
		party_name = winner.party_name;
		person_name = winner.person_name;
		change = ' '+(previous == party ? 'HOLD':'GAIN');
		if(!results.confirmed) change += ' / provisional';
    src = thumbnail(pid); // r.image
	}else{
		party_name = "Awaiting results";
		person_name = "";
		party = "";
		key = "none";
		pid = null;
		change = "";
		src = "/assets/images/missing.svg";
	}
	const c = Colour(key);
	let bg = c.hex;

	if(previous != party){
		const c2 = Colour(previous);
		bg = 'linear-gradient(110deg, ' + c.hex + ' 0%, ' + c.hex + ' calc(100% - 2em), white calc(100% - 2em), white calc(100% - 1.75em), ' + c2.hex + ' calc(100% - 1.75em)), linear-gradient(70deg, ' + c.hex + ' 0%, ' + c.hex + ' calc(100% - 2em), white calc(100% - 2em), white calc(100% - 1.75em), ' + c2.hex + ' calc(100% - 1.75em));background-size: 100% 50%;background-repeat: no-repeat;background-position: top left, bottom left;';
	}
	html += '<div class="winner" style="background:' + bg + ';color:' + c.contrast + ';">';
	if(src) html += '<div class="image"><img src="' + src + '" /></div>';
	html += '<div class="about">';
	html += '<span class="headline">' + party_name + change + '</span>';
	html += '<br />' + (person_name ? 'Elected: <strong>' + person_name + '</strong>':'');
	html += '<br />' + (maj ? 'Majority: <strong>' + maj.toLocaleString() + '</strong>' : '');
	html += '</div>';
	html += '</div>';
	return html;
}