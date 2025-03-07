"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Github, AlertCircle, Code } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCard } from "./UserCard";
import { RepositoryList } from "./RepositoryList";
import { searchGitHubUsersFn } from "@/api/modules/dashboardApi";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { GithubUserDetail } from "../DAO/user.dao";
import UserCardSkeleton from "./UserCardSkeleton";

export function SearchUsers() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<GithubUserDetail | null>(
    null
  );

  const {
    data: users,
    isLoading: loading,
    isError,
    error,
  } = useQuery<GithubUserDetail[], Error>({
    queryKey: ["users", searchQuery],
    queryFn: searchGitHubUsersFn,
    enabled: !!searchQuery,
  } as UseQueryOptions<GithubUserDetail[], Error>);

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    setSelectedUser(null);
    setSearchQuery(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search GitHub users..."
            className="bg-gray-900/60 border-gray-700 text-white pl-10 h-12"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-purple-600 hover:bg-purple-700 h-12"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Searching...
            </div>
          ) : (
            <>
              <Github className="mr-2 h-5 w-5" />
              Search
            </>
          )}
        </Button>
      </div>

      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200 flex items-center"
        >
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error.message}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <UserCardSkeleton />
        ) : (
          <>
            {searchQuery && (
              <h2 className="text-2xl font-bold">
                Search results for{" "}
                <span className="text-purple-400">{searchQuery}</span>
              </h2>
            )}

            {users?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-12 text-center bg-gray-900/30 border border-gray-800 rounded-lg"
              >
                <div className="bg-gray-800/50 p-6 rounded-full mb-4">
                  <Code className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  No users found matching your search criteria.
                </h3>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <AnimatePresence>
                  {users?.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                    >
                      <UserCard
                        user={user}
                        onClick={() => setSelectedUser(user)}
                        isSelected={selectedUser?.id === user.id}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {selectedUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <RepositoryList username={selectedUser.login} />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
