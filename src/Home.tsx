import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const fetchColors = async () => {
  return await axios.get("https://api.sampleapis.com/csscolornames/colors");
};

export default function Home() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["colors"],
    queryFn: fetchColors,
    retry: 2,
    select: (data) => data.data.slice(0, 20),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <div className="min-h-screen bg-zinc-950 p-10">
      <h1 className="text-3xl font-bold text-white mb-8">Color Palette</h1>

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
