import { useLocation, useMatches } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { RouteHandle } from "react-router-dom";
import { useEffect } from "react";

function DocumentHead() {
  const location = useLocation();

  useEffect(() => {
    console.log("Location changed:", location.pathname);
  }, [location.pathname]);
  const matches = useMatches();
  const typedMatches = matches as {
    handle?: RouteHandle;
    pathname: string;
    params: Record<string, string>;
    data: unknown;
    id: string;
    robots: string;
  }[];

  const routesMatch = typedMatches
    .slice()
    .reverse()
    .find((match) => match.handle?.title);

  const handle = routesMatch?.handle;
  const title = handle?.title || "Nova Properties";
  const description =
    handle?.description ||
    "Buy and rent property easily in Ethiopia. NovaProperties is the go-to platform for real estate.";

  // console.log("DocumentHead - Current Route:", {
  //   title,
  //   description,
  //   canonical: handle?.canonical,
  //   structuredData: handle?.structuredData,
  // });

  return (
    <Helmet
      onChangeClientState={(newState) =>
        console.log("Helmet changed:", newState)
      }
    >
      <title>{title}</title>
      <title>Force test</title>
      <meta name="description" content={description} />
      <link
        rel="preconnect"
        href="https://realestate-backend-ixih.onrender.com"
        crossOrigin="true"
      />
      {handle?.canonical && <link rel="canonical" href={handle.canonical} />}
      {handle?.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(handle.structuredData)}
        </script>
      )}
      {handle?.robots && <meta name="robots" content={handle.robots} />}
    </Helmet>
  );
}
export default DocumentHead;
