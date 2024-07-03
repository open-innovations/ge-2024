export default function ({ id, type = "", label, titleSelector="h2", position="top", content }) {

	if(!id) id = crypto.randomUUID();

	let output = '<panelSelector data-dependencies="/assets/js/panelSelector.js" id="'+id+'" data-type="'+type+'" data-title-selector="'+titleSelector+'" data-position="'+position+'">'+content+'</panelSelector>';

	return output;
}