import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const jobCategories = [
  "Plumbing",
  "Electrical",
  "Painting",
  "Carpentry",
  "Appliance Repair",
  "Yard Work",
  "Flooring",
  "Roof Repair",
  "General Maintenance",
  "Cleaning",
];

const Booking = () => {
  const [job, setJob] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!job || !date) return alert("Please select a job type and date.");
    setLoading(true);
    try {
      await addDoc(collection(db, "bookings"), {
        job,
        details,
        date: Timestamp.fromDate(new Date(date)),
        createdAt: Timestamp.now(),
      });
      setSubmitted(true);
      setJob("");
      setDetails("");
      setDate("");
    } catch (err) {
      console.error(err);
      alert("Error submitting booking.");
    }
    setLoading(false);
  };

  if (submitted)
    return (
      <div className="center">
        <h2>Thank you!</h2>
        <p>Your booking request has been submitted.</p>
      </div>
    );

  return (
    <div className="page">
      <h2>Book a Service</h2>
      <form onSubmit={submitBooking} className="form">
        <label>Job Type</label>
        <select value={job} onChange={(e) => setJob(e.target.value)}>
          <option value="">Select...</option>
          {jobCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <label>Preferred Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Details / Notes</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe your project..."
        ></textarea>

        <button disabled={loading} type="submit">
          {loading ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
};

export default Booking; React, {useState} from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '../utils/firebaseConfig';
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Booking(){
  const [name,setName]=useState('Demo Client');
  const [email,setEmail]=useState('client@test.com');
  const [desc,setDesc]=useState('Fix a leaky faucet');
  const [date,setDate]=useState('');

  async function submit(){
    if(!name||!email||!desc||!date){ alert('Complete fields'); return }
    try{
      await addDoc(collection(db,'jobs'),{clientName:name,clientEmail:email,description:desc,date,createdAt:serverTimestamp(),status:'open'});
      alert('Job posted — providers will see it after subscribing.');
    }catch(e){ alert(e.message) }
  }

  return (<div className='max-w-md mx-auto'><h2 className='text-xl font-semibold mb-3'>Post a Job</h2><input className='border p-2 w-full mb-2' value={name} onChange={e=>setName(e.target.value)} /><input className='border p-2 w-full mb-2' value={email} onChange={e=>setEmail(e.target.value)} /><textarea className='border p-2 w-full mb-2' value={desc} onChange={e=>setDesc(e.target.value)} /><input type='date' className='border p-2 w-full mb-2' value={date} onChange={e=>setDate(e.target.value)} /><button onClick={submit} className='bg-black text-white px-4 py-2 rounded'>Submit Job</button></div>)
export const jobTypes = [
  "Drywall repair / patching",
  "Interior painting / touch-up",
  "Exterior painting / siding repair",
  "Light plumbing (faucet, drain, toilet)",
  "Light electrical (fixture, switch, outlet)",
  "Carpentry / trim / molding / cabinetry repair",
  "Door / window repair or installation",
  "Tile & grout work",
  "Floor repairs / refinishing",
  "Furniture / shelving assembly / installation",
  "Fence / gate repair or installation",
  "Deck repair / maintenance",
  "Gutter cleaning / repair",
  "Smart home / device installation",
  "Small appliance installation / mounting",
  "Hanging pictures, mirrors, or TVs",
  "Weatherproofing / caulking / sealing",
  "Exterior maintenance / siding repair",
  "Window treatments, blinds, shades install",
  "Patio / outdoor maintenance / pressure washing"
];
