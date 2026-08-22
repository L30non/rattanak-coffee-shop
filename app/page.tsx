import type { Metadata } from "next";
import App from "./App";
import { buildMetadataForView } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataForView("home");
}

export default function Page() {
  return <App initialView="home" />;
}
