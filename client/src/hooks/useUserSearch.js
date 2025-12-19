import { useEffect, useState } from "react";

const DEBOUNCE_DELAY_MS = 300;

export const useUserSearch = (
  users = [],
  searchFields = ["firstName", "lastName"],
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const searchLower = debouncedSearchQuery.toLowerCase();
    const filtered = users.filter((user) => {
      return searchFields.some((field) => {
        const value = user?.[field]?.toLowerCase() || "";
        return value.includes(searchLower);
      });
    });

    setFilteredUsers(filtered);
  }, [debouncedSearchQuery, users, searchFields]);

  return {
    searchQuery,
    setSearchQuery,
    filteredUsers,
  };
};
