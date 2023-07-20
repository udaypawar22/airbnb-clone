import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  return (
    <div className="my-8 -mx-8 px-8 md:px-16 lg:px-32 xl:px-48">
      <h1 className="text-3xl py-2">{booking.place.title}</h1>
      <AddressLink className={"my-2 block mb-5"}>
        {booking.place.address}
      </AddressLink>
      <div className="bg-gray-200 p-4 mb-4 rounded-xl">
        <h2>Your booking information</h2>
        <BookingDates booking={booking} />
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}
