import lume from "lume/mod.ts";

// Lume plugins
import base_path from "lume/plugins/base_path.ts";
import date from "lume/plugins/date.ts";
import esbuild from "lume/plugins/esbuild.ts";
import favicon from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import metas from "lume/plugins/metas.ts";
// import pagefind from "lume/plugins/pagefind.ts";
import postcss from "lume/plugins/postcss.ts";
import sheets from "lume/plugins/sheets.ts";
import sitemap from "lume/plugins/sitemap.ts";

// OI Lume viz
import oiLumeViz from "oi_lume_viz/mod.ts";
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
site.use(date({
  formats: {
    FRIENDLY: "h:mmaaa 'on' do MMMM",
  },
}));
site.use(esbuild({
  extensions: [".ts"],
}));
site.use(favicon({
  input: "assets/images/oi-logo-black.svg",
}));
site.use(feed({
  output: ["/feed.rss", "/feed.json"],
  query: "constituency !results.last_updated=null",
  sort: "date=desc",
  limit: 20,
  info: {
    title: "GE 2024",
    description: "Open Innovations UK General Election results updated",
    published: new Date(),
    lang: "en",
    generator: true,
  },
  items: {
    title: "=title",
    content: "=description",
    published: "=date",
    description: "=headline",
    image: "=metas.image",
  }
}));
site.use(metas());
// site.use(pagefind());
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
  "assets/images/oi-logo-black.svg",
  "https://open-innovations.org/resources/images/logos/oi-square-black.svg",
);
/*
site.remoteFile(
  "assets/images/missing.svg",
  "https://placehold.co/400/svg?text=No+image",
);
*/

site.copy("assets/images/");
site.copy("assets/fonts/");
site.copy([".js"]);

// Setup filters
import { extractResults, getSelector, setAttributes } from "./lib/filters.ts";
site.filter("extractResults", extractResults);
site.filter("getSelector", getSelector);
site.filter("setAttributes", setAttributes);

export default site;
