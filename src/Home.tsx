import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { useDebounce } from "./useDebounce";

const fetchColors = async () => {
  return await axios.get("https://api.sampleapis.com/csscolornames/colors");
};

export default function Home() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000)
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["colors", debouncedSearch],
    queryFn: fetchColors,
    retry: 2,
    select: (data) => {
      const colors = data.data

      if(!debouncedSearch) return colors.slice(0,30)

      return colors.filter((c: any) => c.name.toLowerCase().includes(debouncedSearch.toLowerCase())).slice(0, 30)
    }
  });

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
    </div>
  );
}
