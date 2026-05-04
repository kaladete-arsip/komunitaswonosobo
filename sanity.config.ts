import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { komunitasSchema } from "./sanity/schemas/komunitas";
import { postSchema, galeriSchema, videoSchema } from "./sanity/schemas/content";

export default defineConfig({
  name: "komunitaswonosobo",
  title: "Komunitas Wonosobo — Studio",
  projectId: "j6xyflna",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [komunitasSchema, postSchema, galeriSchema, videoSchema],
  },
});