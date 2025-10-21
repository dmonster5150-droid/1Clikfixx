import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const ProviderPortal = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const getJobs = async () => {
      const snapshot = await getDocs(collection(db, "bookings"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setJobs(data);
    };
    getJobs();
  }, []);

  const markComplete = async (id) => {
    const ref = doc(db, "bookings", id);
    await updateDoc(ref, { status: "completed" });
    alert("Marked as completed");
  };

  return (
    <div className="page">
      <h2>Provider Portal</h2>
      {jobs.length === 0 ? (
        <p>No jobs yet.</p>
      ) : (
        <ul className="job-list">
          {jobs.map((job) => (
            <li key={job.id}>
              <strong>{job.job}</strong> — {job.details}
              <br />
              <button onClick={() => markComplete(job.id)}>
                Mark Complete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProviderPortal; React from 'react'
export default function ProviderForm(){ return (<div className="page"><h1>Provider Skills & Agreement</h1><p>Form for providers to enter skills, vehicle, tool ownership, certifications, and accept the agreement.</p></div>) }
