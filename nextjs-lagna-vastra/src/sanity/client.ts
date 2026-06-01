import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "p0wrf5zn",
  dataset: "production",
  apiVersion: "2026-05-15",
  useCdn: false,
});
