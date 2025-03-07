import React, { Suspense } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div>
      {import.meta.env.VITE_MAINTANANCE_MODE === "true" ? (
        <div>
          <div>
            <p>Kami Akan Segera Kembali!</p>
            <p>
              Situs web kami sedang menjalani pemeliharaan terjadwal untuk
              meningkatkan pengalaman Anda. Kami mohon maaf atas ketidaknyamanan
              yang ditimbulkan.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <Outlet />
          <Suspense>
            <TanStackRouterDevtools />
          </Suspense>
        </div>
      )}
    </div>
  );
}
