export default function ({ title, id, classes, content, }) {
	let output = '<article id="'+(id || crypto.randomUUID())+'" role="tabpanel"';
	if(title) output += ' data-tab-title="'+title+'"';
	if(classes) output += ' class="'+classes+'"';
	output += '>'+content+'</article>';
	return output;
}