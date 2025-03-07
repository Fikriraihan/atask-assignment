import { motion, AnimatePresence } from "framer-motion";
import { Star, GitFork, Clock, ExternalLink, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserRepositoriesFn } from "@/api/modules/dashboardApi";
import { GithubRepository } from "../DAO/repo.dao";
import { useQuery } from "@tanstack/react-query";

interface RepositoryListProps {
  username: string;
}

export function RepositoryList({ username }: RepositoryListProps) {
  const {
    data: userRepo,
    isLoading: isRepoLoading,
  }: { data: GithubRepository[] | undefined; isLoading: boolean } = useQuery({
    queryKey: ["repo", username],
    queryFn: getUserRepositoriesFn,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold">
          Repositories for <span className="text-purple-400">{username}</span>
        </h2>
        <Badge
          variant="outline"
          className="bg-purple-900/30 text-purple-300 px-3 py-1"
        >
          {userRepo?.length} repos
        </Badge>
      </motion.div>

      {!isRepoLoading && userRepo?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-12 text-center bg-gray-900/30 border border-gray-800 rounded-lg"
        >
          <div className="bg-gray-800/50 p-6 rounded-full mb-4">
            <Code className="h-12 w-12 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Repositories Found</h3>
          <p className="text-gray-400 max-w-md">
            {username} doesn't have any public repositories yet or they might
            all be private.
          </p>
        </motion.div>
      )}

      {isRepoLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-gray-800 bg-gray-900/60">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-[200px]" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
          className="grid grid-cols-1 gap-4"
        >
          <AnimatePresence>
            {userRepo?.map((repo) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-gray-800 bg-gray-900/60 hover:bg-gray-900/80 transition-colors overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        {repo.name}
                      </span>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-400 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {repo.description && (
                      <p className="text-gray-300">{repo.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      {repo.language && (
                        <Badge
                          variant="outline"
                          className="bg-gray-800/50 text-gray-300"
                        >
                          <Code className="h-3 w-3 mr-1" />
                          {repo.language}
                        </Badge>
                      )}

                      <Badge
                        variant="outline"
                        className="bg-gray-800/50 text-gray-300"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {repo.stargazers_count}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="bg-gray-800/50 text-gray-300"
                      >
                        <GitFork className="h-3 w-3 mr-1" />
                        {repo.forks_count}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="bg-gray-800/50 text-gray-300"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Updated {formatDate(repo.updated_at)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
