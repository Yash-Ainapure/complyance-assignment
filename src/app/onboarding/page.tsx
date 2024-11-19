"use client";
import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";
import axios from "axios";

export default function OnboardingComponent() {
  const [error, setError] = React.useState("");
  const { user } = useUser();
  const router = useRouter();
  const [role, setRole] = React.useState("");
  const [assignedCountry, setAssignedCountry] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  console.log("userdhddh");
  console.log(user);
  console.log(user?.id);
  console.log(user?.primaryEmailAddress?.emailAddress);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (role === "viewer" && assignedCountry.length === 0) {
      setError("Viewers must have at least one assigned country");
      return;
    }
    if (role === "admin") {
      setAssignedCountry("");
    }
    const data = {
      id: user?.id,
      email: user?.primaryEmailAddress?.emailAddress,
      role: role,
      assignedCountry: assignedCountry,
    };
    try {
      setLoading(true);
      const res = await axios.post("/api/createUser", JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        const res = await completeOnboarding();
        if (res?.message) {
          // Reloads the user's data from the Clerk API
          await user?.reload();
          router.push("/");
        }
        if (res?.error) {
          setError(res?.error);
        }
      }
      console.log("res", res);
    } catch (err) {
      console.error("err", err);
    } finally {
      setLoading(false);
    }
    return;
  };
  return (
    <div className="flex flex-col gap-2 p-4 items-center justify-center min-h-screen">
      <h1 className="font-semibold text-2xl underline">
        Welcome to onboarding Screen
      </h1>
      <p>Here we select your role and country for seamless experience</p>
      <p className="text-red-500">
        ( This onboarding page occurs 1st time only while registering)
      </p>
      <form
        className="flex flex-col gap-4 items-center justify-center"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-center gap-2">
          <label>Choose your Role:</label>
          <select
            required
            onChange={(event) => {
              event.preventDefault();
              setRole(event.target.value);
            }}
            className="text-white rounded-md bg-black p-2 "
            name=""
            id="role"
          >
            <option value=""> select role</option>
            <option value="admin">admin</option>
            <option value="viewer">viewer</option>
          </select>
        </div>
        {role === "viewer" && (
          <div className="flex items-center justify-center gap-2">
            <label>Choose your country</label>
            <select
              onChange={(event) => {
                event.preventDefault();
                setAssignedCountry(event.target.value);
              }}
              className="text-white rounded-md bg-black p-2 "
              name=""
              id="role"
            >
              <option value=""> select country</option>
              <option value="india">India</option>
              <option value="america">America</option>
              <option value="china">China</option>
              <option value="japan">Japan</option>
              <option value="australia">Australia</option>
              <option value="russia">Russia</option>
            </select>
          </div>
        )}
        {error && <p className="text-red-600">Error: {error}</p>}
        <button className="bg-black text-white p-2 rounded-md" type="submit">
          {loading ? "Submiting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
