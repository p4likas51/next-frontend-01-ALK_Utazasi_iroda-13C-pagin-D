"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
// import { useGlobalStore } from "@/store/globalStore";
import { useRouter } from "next/navigation";

export type JourneyItem = {
  id: number;
  vehicle: Vehicle;
  country: string;
  description: string;
  departure: Date;
  capacity: number | null;
  pictureUrl: string;
};

export type Vehicle = {
  id: number;
  type: string;
};

export default function JourneysPage() {
  const [journes, setJournes] = useState<JourneyItem[]>([]);

  // const { setId } = useGlobalStore();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("http://localhost:3000/api/journeys");
      setJournes(res.data);
    }
    fetchData();
  }, []);

  function handleClick(id: number) {
    // Megoldás1: GlobalStore-zustand-el
    // setId(id);
    // router.push("/registration")

    // Megoldás2: query paraméterel
    router.push(`/registration?id=${id}`)

  }

  return (
    <div className="min-h-scree">
      <h1 className="text-center text-3xl font-bold">Kínálatunk</h1>
      <div className="mx-auto w-[95%] border border-gray-600">
        <table>
          <thead>
            <tr className="border-b border-gray-400 bg-white">
              <th>Ország</th>
              <th>Utazási mód</th>
              <th>Indulás</th>
              <th>Max. létszám</th>
              <th>Leírás</th>
              <th>Fénykép</th>
            </tr>
          </thead>
          <tbody>
            {journes.map((journey) => (
              <tr className="border-b border-gray-400 bg-white" key={journey.id}>
                <td>{journey.country}</td>
                <td>{journey.vehicle.type}</td>
                <td>{journey.departure.toString()}</td>
                <td>{journey.capacity}</td>
                <td>
                  {journey.description}
                  <button
                    className="btn ml-3 rounded-xl btn-info"
                    onClick={() => handleClick(journey.id)}
                  >
                    Érdekel
                  </button>
                </td>
                <td className="min-w-[250px]">
                  <Image
                    alt="kép"
                    className="m-4 mx-auto h-[100px] w-auto rounded-xl shadow-lg"
                    height={100}
                    src={journey.pictureUrl}
                    width={200}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
