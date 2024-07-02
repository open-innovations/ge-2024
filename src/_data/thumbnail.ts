import thumbnails from "../../data/thumbnails.json" with { type: "json" };

export default (id: string) => thumbnails[id];
