import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";

export default function Header() {
  const { user } = useContext(UserContext);
  const [searchButton, setSearchButton] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestionValues, setSuggestionValues] = useState([]);
  const [sugBox, setSugBox] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    suggestions();
  }, [searchValue]);

  async function searchItems() {
    let flag = false;
    if (!searchButton) {
      setSearchButton(true);
      return;
    } else if (searchValue && searchButton) {
      const { data } = await axios.get(`/places?title=${searchValue}`);
      console.log(data);
      if (data.length > 0) {
        flag = true;
        setSearchValue("");
        nav(`place/${data[0]._id}`);
      }
    }

    if (!flag) {
      alert("No results found");
    }

    setSearchButton(false);
  }

  function handleSuggestionBox() {
    setSugBox(true);
  }

  async function suggestions() {
    if (!searchValue) return;
    const { data } = await axios.get(`/places?title=${searchValue}`);
    setSuggestionValues(data);
  }
  return (
    <header className="flex justify-between">
      <Link to={"/"} className="flex items-center gap-1 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 -rotate-90"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
        <span className="font-bold text-xl">airbnb</span>
      </Link>
      <div className="flex border gap-2 border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-200">
        <div>Anywhere</div>
        <div className="border border-l border-gray-100"></div>
        <div>Any week</div>
        <div className="border border-l border-gray-100"></div>
        <div>Add guests</div>
        {/* color used here bg-primary is defined in tailwind.config file */}
        <div className="grid gap-2 relative">
          <div className="flex gap-1 items-center">
            {searchButton && (
              <div>
                <input
                  type="text"
                  className="custom-tb"
                  value={searchValue}
                  onChange={(ev) => setSearchValue(ev.target.value)}
                  onFocus={handleSuggestionBox}
                />
              </div>
            )}
            <button
              className="bg-primary text-white p-1 rounded-full"
              onClick={searchItems}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
          <>
            {sugBox && searchValue && (
              <div className="shadow-lg absolute top-full left-0 right-0 mt-4 bg-white text-sm rounded-md">
                {suggestionValues.length > 0 &&
                  suggestionValues.map((item) => (
                    <div
                      className="truncate py-1 px-1 cursor-pointer"
                      onClick={() => {
                        console.log("clicked");

                        setSearchValue(item.title);
                        setSugBox(false);
                      }}
                    >
                      {item.title}
                    </div>
                  ))}
              </div>
            )}
          </>
        </div>
      </div>

      <Link
        to={user ? "/account" : "/login"}
        className="flex items-center border gap-2 border-gray-300 rounded-full py-2 px-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 relative top-1"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {!!user && (
          <div className="text-ellipsis max-w-[50px] overflow-hidden whitespace-nowrap">
            {user.name}
          </div>
        )}
      </Link>
    </header>
  );
}
