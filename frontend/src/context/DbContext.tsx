"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setApiDb, databasesApi, DatabaseInfo } from "@/lib/api";

interface DbContextValue {
  currentDb: string;
  defaultDb: string;
  databases: DatabaseInfo[];
  setCurrentDb: (db: string) => void;
}

const DbContext = createContext<DbContextValue>({
  currentDb: "",
  defaultDb: "",
  databases: [],
  setCurrentDb: () => {},
});

export function DbProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [defaultDb, setDefaultDb] = useState("");
  const [databases, setDatabases] = useState<DatabaseInfo[]>([]);
  const [currentDb, _setCurrentDb] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedDb") || "";
    }
    return "";
  });

  // Fetch available databases once on mount
  useEffect(() => {
    databasesApi
      .list()
      .then((data) => {
        setDefaultDb(data.default);
        setDatabases(data.available);
        // If stored selection no longer exists, clear it
        if (
          currentDb &&
          !data.available.find((d) => d.key === currentDb)
        ) {
          _setCurrentDb("");
          localStorage.removeItem("selectedDb");
        }
      })
      .catch(() => {});
  }, []);

  // Keep axios default params in sync
  useEffect(() => {
    setApiDb(currentDb || undefined);
  }, [currentDb]);

  const setCurrentDb = useCallback(
    (db: string) => {
      _setCurrentDb(db);
      if (db) {
        localStorage.setItem("selectedDb", db);
      } else {
        localStorage.removeItem("selectedDb");
      }
      // Clear React Query cache so all queries re-fetch against new DB
      queryClient.clear();
    },
    [queryClient]
  );

  return (
    <DbContext.Provider value={{ currentDb, defaultDb, databases, setCurrentDb }}>
      {children}
    </DbContext.Provider>
  );
}

export function useDb() {
  return useContext(DbContext);
}
