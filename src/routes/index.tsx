import { SearchUsers } from "@/modules/Home/components/SearchUsers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
            GitHub Explorer
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Search for GitHub users and explore their repositories with this
            sleek, animated interface. Enter a username to get started.
          </p>
        </header>
        <main>
          <SearchUsers />
        </main>
      </div>
    </div>
  );
}
