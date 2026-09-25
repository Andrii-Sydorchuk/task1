import type { RouteObject } from "react-router";
import Root from "./Root";
import App from "./App";

export const routes = [
  {
    element: <Root />,
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },
] satisfies RouteObject[];
