import lume from "lume/mod.ts";

// Lume plugins
import base_path from "lume/plugins/base_path.ts";
import date from "lume/plugins/date.ts";
import esbuild from "lume/plugins/esbuild.ts";
import favicon from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import metas from "lume/plugins/metas.ts";
import pagefind from "lume/plugins/pagefind.ts";
import sheets from "lume/plugins/sheets.ts";
import sitemap from "lume/plugins/sitemap.ts";
import postcss from "lume/plugins/postcss.ts";

// OI Lume viz
import oiLumeViz from "https://deno.land/x/oi_lume_viz@v0.15.6/mod.ts";
// Local config (data files) for insertion into oiLumeViz plugin
import { names } from "./src/_data/colour.ts";

// Loaders
import json from "lume/core/loaders/json.ts";

// Processors
import autoDependency from "https://deno.land/x/oi_lume_utils@v0.4.0/processors/auto-dependency.ts";

const site = lume({
  src: "./src",
  location: new URL("https://ge2024.hexmap.uk/"),
});

site.data("cms", "https://cms.ge-2024.open-innovations.org/");

// Set up plugins
site.use(date());
site.use(esbuild());
site.use(favicon({
  input: "assets/images/oi-logo.svg",
}));
site.use(feed());
site.use(metas());
site.use(pagefind());
site.use(sitemap());
site.use(oiLumeViz({
  colour: { names },
}));
site.use(sheets());
site.use(postcss());

site.process([".html"], (pages) => pages.forEach(autoDependency));
site.use(base_path());

site.loadData([".hexjson"], json);

site.remoteFile(
  "assets/images/oi-logo.svg",
  "https://open-innovations.org/resources/images/logos/oi-square-white.svg",
);

site.remoteFile(
  "assets/images/missing.svg",
  "https://placehold.co/400/svg?text=No+image",
);

site.copy("assets/images/");
site.copy("assets/fonts/");

export default site;
