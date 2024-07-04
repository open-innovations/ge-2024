import lume from "lume/mod.ts";
import redirects from "lume/plugins/redirects.ts";

const site = lume();

site.use(redirects());

export default site;
