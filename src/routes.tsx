import type { RouteObject } from "react-router";
import Root from "./Root";
import App from "./App";
import { TABS } from "./tabs";
import Content from "./Content/Content";

export const routes = [
  {
    element: <Root />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          ...TABS.map((tab) => ({
            path: tab.path,
            element: <Content />,
          })),
        ],
      },
    ],
  },
] satisfies RouteObject[];
