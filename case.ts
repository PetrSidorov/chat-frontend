import { useEffect, useState } from "react";

function useGlobalData() {
  // ...
}

function setGlobalData(data) {
  // ...
}

// actions.ts

async function fetchPatient(patientId: string) {
  try {
    // api returns 404 - if not found
    // api returns 403 - if unauthroized
    // api returns 400 - in all other cases
    const response = await fetch(`/api/v1/patients/${patientId}`);
    if (!response.ok) {
      throw new Error("error occured fetch the patient");
    }
    const data = await response.json();
    setGlobalData(data);
  } catch (err) {}
}

async function fetchPatientWithError(patientId: string) {
  // api returns 404 - if not found
  // api returns 403 - if unauthroized
  const response = await fetch(`/api/v1/patients/${patientId}`);
  if (!response.ok) {
    throw new Error("error occured fetch the patient", {
      cause: { response },
    });
  }
  const data = await response.json();
  setGlobalData(data);
}

// component.ts

function Component() {
  const data = useGlobalData();
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    async function f() {
      try {
        fetchPatientWithError("25");
      } catch (err) {
        if (
          err instanceof Error &&
          err.cause instanceof Response &&
          err.cause.status == 404
        ) {
          setIsNotFound(true);
        } else {
          console.log(err);
        }
      }
    }
    f();
  }, []);

  if (!data) {
    return "loading";
  }

  return data;
}
