"use client";

import axios from "axios";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export interface JourneyItem {
  id: number;
  vehicle: { id: number; type: string };
  country: string;
  description: string;
  departure: string;
  capacity: number;
  pictureUrl: string;
}

export default function JourneysTablePage() {
  const [journeys, setJourneys] = useState<JourneyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [actualPage, setActualPage] = useState<number>(1);
  const [numberOfRecords, setNumberOfRecords] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const limit: number = 4;

  const getJourneys = useCallback(async () => {
    try {
      const filter = searchTerm.trim() === "" ? "*" : searchTerm;
      const res = await axios.get(
        `http://localhost:3000/api/journeys/${actualPage}/${limit}/${filter}`,
      );

      const data = res.data;
      setJourneys(data);

      const totalHeader = res.headers["number-of-records"];

      if (totalHeader) {
        const total = parseInt(totalHeader);
        setNumberOfRecords(total);
        setHasMore(actualPage * limit < total);
      } else {
        const hasNext = data.length === limit;
        setHasMore(hasNext);
        const seenSoFar = (actualPage - 1) * limit + data.length;
        setNumberOfRecords(hasNext ? seenSoFar + 1 : seenSoFar);
      }
    } catch (error) {
      console.error("Lekérési hiba:", error);
    }
  }, [actualPage, searchTerm, limit]);

  useEffect(() => {
    getJourneys();
  }, [getJourneys]);

  const numberOfPages = totalHeaderAvailable()
    ? Math.max(1, Math.ceil(numberOfRecords / limit))
    : hasMore
      ? actualPage + 1
      : actualPage;

  function totalHeaderAvailable() {
    // Ez csak egy segédfüggvény a logikához
    return numberOfRecords > actualPage * limit && !hasMore;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-6 text-gray-800">
      <h1 className="mb-8 text-center text-3xl font-bold">Utazási Ajánlatok</h1>

      <div className="mb-8 w-full max-w-xl">
        <div className="group relative">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
          <input
            className="w-full rounded-xl border-2 border-gray-200 py-3 pr-4 pl-12 shadow-sm transition-all outline-none focus:border-blue-500"
            placeholder="Keresés ország vagy leírás alapján..."
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setActualPage(1);
            }}
          />
        </div>
      </div>

      <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
        <table className="w-full text-left">
          <thead className="border-b-2 border-gray-100 bg-gray-50">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Fotó</th>
              <th className="p-4 font-semibold text-gray-600">Ország</th>
              <th className="p-4 font-semibold text-gray-600">Jármű</th>
              <th className="p-4 text-center font-semibold text-gray-600">Indulás</th>
              <th className="p-4 text-center font-semibold text-gray-600">Férőhely</th>
              <th className="p-4 font-semibold text-gray-600">Leírás</th>
            </tr>
          </thead>
          <tbody>
            {journeys.length > 0 ? (
              journeys.map((item) => (
                <tr
                  key={item.id}
                  className="group border-b transition-colors last:border-0 hover:bg-blue-50/30"
                >
                  <td className="p-4">
                    <div className="relative h-16 w-24 overflow-hidden rounded-lg shadow-sm">
                      <img
                        src={item.pictureUrl}
                        alt={item.country}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-700">{item.country}</td>
                  <td className="p-4 text-xs tracking-wider uppercase">
                    <span className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700">
                      {item.vehicle.type}
                    </span>
                  </td>
                  <td className="p-4 text-center text-sm font-medium">{item.departure}</td>
                  <td className="p-4 text-center font-mono font-bold text-blue-600">
                    {item.capacity} fő
                  </td>
                  <td
                    className="max-w-xs truncate p-4 text-sm text-gray-500"
                    title={item.description}
                  >
                    {item.description}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-400 italic">
                  Nincs találat
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Lapozó */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl border-2 p-3 transition-all hover:border-blue-500 hover:bg-white disabled:opacity-30 disabled:hover:border-gray-200"
            onClick={() => setActualPage(1)}
            disabled={actualPage <= 1}
          >
            <ChevronsLeft size={20} />
          </button>

          <button
            className="flex items-center rounded-xl border-2 px-6 py-2.5 font-semibold transition-all hover:border-blue-500 hover:bg-white disabled:opacity-30 disabled:hover:border-gray-200"
            onClick={() => setActualPage((prev) => Math.max(1, prev - 1))}
            disabled={actualPage <= 1}
          >
            <ChevronLeft size={20} className="mr-1" /> Vissza
          </button>

          <div className="min-w-[100px] rounded-xl bg-blue-600 px-6 py-2.5 text-center font-bold text-white shadow-md">
            Oldal: {actualPage}/{numberOfPages}
          </div>

          <button
            className="flex items-center rounded-xl border-2 px-6 py-2.5 font-semibold transition-all hover:border-blue-500 hover:bg-white disabled:opacity-30 disabled:hover:border-gray-200"
            onClick={() => setActualPage((prev) => prev + 1)}
            disabled={!hasMore}
          >
            Következő <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
