import { routeMeta } from "@/routes/routesMeta";

declare module "react-router-dom" {
  interface RouteHandle {
    title?: string;
    description?: string;
    canonical?: string;
    structuredData?: object;
  }
}
