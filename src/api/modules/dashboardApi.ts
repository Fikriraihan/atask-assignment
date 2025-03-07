import { QueryParams } from "@/types";
import { callApi } from "../interceptors";
import { GithubUserDetail } from "@/modules/Home/DAO/user.dao";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const getUserRepositories = async (username: string) => {
  return callApi(`/users/${username}/repos`, "GET", null, null, null, {
    Accept: "application/vnd.github.v3+json",
  });
};

export const searchGitHubUsers = async (query: string) => {
  return callApi(
    "/search/users",
    "GET",
    null,
    null,
    { q: query, per_page: 5 },
    { Accept: "application/vnd.github.v3+json" }
  );
};
export const userDetail = async (username: string) => {
  return callApi(`/users/${username}`, "GET", null, null, null, {
    Accept: "application/vnd.github.v3+json",
  });
};

export const searchGitHubUsersFn = async (queryParams: QueryParams) => {
  const query = queryParams.queryKey[1];

  try {
    const res = await searchGitHubUsers(query);
    if (
      !res.data.items ||
      !Array.isArray(res.data.items) ||
      res.data.items.length === 0
    ) {
      return [];
    }

    const userPromises = res.data.items.map(async (user: GithubUserDetail) => {
      try {
        const userRes = await userDetail(user.login);
        return userRes.data;
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    });

    const userDetailResults = await Promise.all(userPromises);
    const validUser = userDetailResults.filter(
      (user: GithubUserDetail) => user !== null
    );
    return validUser;
  } catch (error) {
    console.error("Error in searchGitHubUsersFn:", error);
    throw error;
  }
};

export const userDetailFn = async (queryParams: QueryParams) => {
  const username = queryParams.queryKey[1];
  const res = await userDetail(username);
  return res.data;
};

export const getUserRepositoriesFn = async (queryParams: QueryParams) => {
  const username = queryParams.queryKey[1];
  const res = await getUserRepositories(username);
  return res.data;
};
