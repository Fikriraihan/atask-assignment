import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import qs from "qs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { routeTree } from "./routeTree.gen";
import "./index.css";

function customParser(searchString: string) {
  return qs.parse(searchString, { ignoreQueryPrefix: true });
}

function customStringifier(searchObj: Record<string, unknown>) {
  return qs.stringify(searchObj, { addQueryPrefix: true });
}

const router = createRouter({
  routeTree,
  parseSearch: customParser,
  stringifySearch: customStringifier,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <ToastContainer />
    </StrictMode>
  );
}
