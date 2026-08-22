import App from "@/app/App";
import { hrefToView } from "@/lib/routes";

/**
 * The site is a single-page app driven by App.tsx's internal `currentView`
 * state, not by file-based routes — every "page" here renders the same shell.
 * This catch-all exists so a hard refresh (or a shared link) on a deep URL
 * like /cart or /product/<id> hits a real route instead of 404ing, then hands
 * the resolved view to App as its first-paint state.
 */
export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const initialView = hrefToView(`/${(slug ?? []).join("/")}`);
  return <App initialView={initialView} />;
}
