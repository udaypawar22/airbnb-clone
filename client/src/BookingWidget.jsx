import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [noOfGuests, setNoOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState(``);
  const [pointer, setPointer] = useState(" cursor-not-allowed");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (numberOfDays > 0 && mobile && name) {
      setPointer(" cursor-pointer");
    } else {
      setPointer(" cursor-not-allowed");
    }
  }, [checkIn, checkOut, mobile, name]);

  let numberOfDays = 0;
  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookPlace() {
    if (numberOfDays > 0 && mobile && name) {
      if (!user) {
        setRedirect("/login");
      } else {
        const data = {
          place: place._id,
          checkIn,
          checkOut,
          noOfGuests,
          name,
          phone: mobile,
          price: numberOfDays * place.price,
        };
        const response = await axios.post("/bookings", data);
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
      }
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl grid gap-2">
      <div className="text-xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-2 px-4 w-1/2">
            <label className="text-sm">Check in </label>
            <br />
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-2 px-4 border-l">
            <label className="text-sm">Check out </label>
            <br />
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-2 px-4 border-t">
          <label className="text-sm">Number of guests </label>
          <br />
          <input
            type="number"
            value={noOfGuests}
            onChange={(ev) => setNoOfGuests(ev.target.value)}
          />
        </div>
        {numberOfDays > 0 && (
          <div className="py-2 px-4 border-t">
            <label className="text-sm">Your full name </label>
            <br />
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label className="text-sm">Phone number </label>
            <br />
            <input
              type="tel"
              value={mobile}
              onChange={(ev) => setMobile(ev.target.value)}
            />
          </div>
        )}
      </div>
      <button className={"primary mt-4 pointer" + pointer} onClick={bookPlace}>
        Book this place
        {numberOfDays > 0 && <span> ${numberOfDays * place.price}</span>}
      </button>
    </div>
  );
}
