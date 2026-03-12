"use client";

import axios, { isAxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
// import { useGlobalStore } from "@/store/globalStore";

export type JourneyShortItem = {
  id: number;
  destination: string;
};

export type ReserveItem = {
  journeyId: number;
  name: string;
  email: string;
  numberOfParticipants: number;
  lastCovidVaccineDate: string;
  acceptedConditions: boolean;
};

export default function RegistrationPage() {
  const router = useRouter();
  // const { id, setId } = useGlobalStore();

  // Megoldás2: Query paraméterrel
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));


  const [destination, setDestination] = useState<JourneyShortItem[]>([]);

  const [newReservation, setNewReservation] = useState<ReserveItem>({
    journeyId: id || 0,
    lastCovidVaccineDate: new Date().toISOString().split("T")[0],
    acceptedConditions: false,
  } as ReserveItem);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("http://localhost:3000/api/journeys/short");
      setDestination(res.data);
    }
    fetchData();
    // setId(0);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/reserve", newReservation);
      toast.success(`Regisztációját ${res.data.id}-s azonosítószámon rögzítettük.`);
      router.push("/journeys");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(`Hiba: ${error.response?.data.message}`);
      } else toast.error("Ismeretlen hiba!");
    }
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-200">
      <form
        className="flex w-[80%] flex-col gap-4 rounded-2xl bg-white p-4 shadow-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-3xl font-bold">Regisztráció</h1>
        <div className="w-full">
          <label>Utazás:</label>
          <select
            className="slect w-full border select-primary"
            value={newReservation.journeyId}
            onChange={(e) =>
              setNewReservation({ ...newReservation, journeyId: Number(e.target.value) })
            }
          >
            <option disabled value={0}>
              Válasszon!
            </option>
            {destination.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {dest.destination}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Az Ön neve</label>
          <input
            className="input w-full input-primary"
            type="text"
            onChange={(e) => setNewReservation({ ...newReservation, name: e.target.value })}
          />
        </div>
        <div>
          <label>Az Ön e-mail címe</label>
          <input
            className="input w-full input-primary"
            type="e-mail"
            onChange={(e) => setNewReservation({ ...newReservation, email: e.target.value })}
          />
        </div>
        <div>
          <label>Résztvevők száma</label>
          <input
            className="input w-full input-primary"
            type="number"
            onChange={(e) =>
              setNewReservation({ ...newReservation, numberOfParticipants: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <label>Utolsó COVID oltásának dátuma</label>
          <input
            className="input w-full input-primary"
            defaultValue={newReservation.lastCovidVaccineDate}
            type="date"
            onChange={(e) =>
              setNewReservation({ ...newReservation, lastCovidVaccineDate: e.target.value })
            }
          />
        </div>
        <div>
          <input
            checked={newReservation.acceptedConditions}
            className="mr-2"
            type="checkbox"
            onChange={(e) =>
              setNewReservation({ ...newReservation, acceptedConditions: e.target.checked })
            }
          />
          <label>Felhasználási feltételeket elfogasom</label>
        </div>
        <div>
          <input className="btn mx-auto block w-40 btn-primary" type="submit" value="Küldés" />
        </div>
      </form>
      {/* {JSON.stringify(destination)} */}
      {/* {JSON.stringify(newReservation)} */}
    </div>
  );
}
