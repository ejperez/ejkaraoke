import { useState, useEffect } from "react";

export default function useRemoteFaves() {
  const storedFaves = JSON.parse(localStorage.getItem("faves") || "[]");
  const [faves, setFaves] = useState(storedFaves);
  const currentFaveIds = faves.map((item) => item.id);

  useEffect(() => {
    localStorage.setItem("faves", JSON.stringify(faves));
  }, [faves]);

  const addFave = (item) => {
    if (currentFaveIds.includes(item.id)) {
      return faves;
    }

    setFaves((currentFaves) => [...currentFaves, item]);
  };

  const isInFaves = (id) => {
    const currentFaves = JSON.parse(localStorage.getItem("faves") || "[]");
    const currentFaveIds = currentFaves.map((item) => item.id);

    return currentFaveIds.includes(id);
  };

  const removeFromFaves = (id) => {
    setFaves((currentFaves) => currentFaves.filter((item) => item.id !== id));
  };

  return { faves, addFave, isInFaves, removeFromFaves };
}
