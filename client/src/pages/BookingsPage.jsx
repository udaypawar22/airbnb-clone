import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="grid gap-1">
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link
              to={`/account/bookings/${booking._id}`}
              className="flex gap-4 bg-gray-200 rounded-md overflow-hidden"
            >
              <div className="w-48 shrink-0">
                <PlaceImg
                  place={booking.place}
                  className={"object-cover aspect-square"}
                />
              </div>
              <div className="py-3 grow pr-3 text-gray-600">
                <h2 className="text-xl text-black">{booking.place.title}</h2>
                <BookingDates booking={booking} />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
