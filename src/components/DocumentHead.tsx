import { useMatches } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function DocumentHead() {
  const matches = useMatches();
  const match = matches[matches.length - 1] as {
    handle?: { title?: string; description?: string };
  };
  const title = match.handle?.title || "Nova Properties";
  const description = match.handle?.description || "";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}
export default DocumentHead;
