// This code creates a central API layer using RTK Query.
// Instead of: writing fetch / axios everywhere
// manually handling loading, error, caching, refetching
// RTK Query does all of that for you.

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// @reduxjs/toolkit/query/react , React version , Adds React hooks like: useGetUsersQuery , useMutation. Built on top of the core version

const Base_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// createApi → creates an API slice

// fetchBaseQuery → a tiny wrapper around fetch
// similar to axios
// handles headers, base URL, credentials, etc.
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: Base_URL,
    credentials: "include",
  }),
  tagTypes: ["user"],
  endpoints: (builder) => ({}),
});
