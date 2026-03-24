import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

const fetchColors = async () => {
  return await axios.get("https://api.sampleapis.com/csscolornames/colors");
};

export default function Home() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["colors", debouncedSearch, page],
    queryFn: fetchColors,
    retry: 2,
    placeholderData: (prev) => prev,
    select: (data) => {
      const colors = data.data;

      const filtered = debouncedSearch
        ? colors.filter((c: any) =>
            c.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
          )
        : colors;

      const start = (page - 1) * limit;
      const end = page * limit;

      return filtered.slice(start, end);
    },
  });

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <div className="min-h-screen bg-zinc-950 p-10">
      <h1 className="text-3xl font-bold text-white mb-8">Color Palette</h1>

      <input
        type="text"
        className="mb-6 px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search color..."
      />

      <div className="grid grid-cols-5 gap-6">
        {data.map((color: any) => (
          <div
            key={color.id}
            className="group rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Цвет */}
            <div
              className="h-32 w-full transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: color.hex }}
            />

            {/* Инфа */}
            <div className="p-4 flex flex-col gap-1">
              <p className="text-white font-semibold tracking-tight">
                {color.name}
              </p>

              <span className="text-zinc-400 text-sm font-mono">
                {color.hex}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-zinc-800 text-white rounded"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-zinc-800 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
