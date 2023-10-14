import { Link } from "react-router-dom";
import "./Header.css";
import Stocks from "./Stocks";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../languageSlice";
import { useContext, useRef } from "react";
import darkmode from "./Darkmode";
import { RootState } from "../store";
import { MutableRefObject } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language.value);
  const [isDarkmode, setDarkmode] = useContext(darkmode);
  const mobileNavRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  return (
    <header>
      <nav
        className={`header fixed flex w-full justify-end font-light lg:h-20 xl:h-16 ${
          isDarkmode
            ? `bg-blue-950 ` /* Dark mode styling */
            : `p-4" bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 ` /* Light mode styling */
        } py-5`}
      >
        <section className="relative mt-1 w-full overflow-hidden 2xl:mt-0">
          <div className=" stock-duplicate-container absolute left-0 flex ">
            <div className=" stock-duplicate flex justify-around">
              <Stocks />
            </div>

            <div className=" stock-duplicate flex justify-around">
              <Stocks />
            </div>
          </div>
        </section>
        <section>
          <ul className="navbar">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/">Portfolio</Link>
            </li>
            <li>
              <Link to="/">About</Link>
            </li>
            <li>
              <div className="flex items-center space-x-2">
                <select
                  id="language"
                  name="language"
                  className="rounded-md border border-gray-300 px-2 py-1 text-gray-800 focus:border-blue-500 focus:outline-none"
                  onChange={(e) => {
                    dispatch(setLanguage(e.target.value));
                  }}
                  value={language}
                >
                  <option value="en">English</option>
                  <option value="de">German</option>
                </select>
              </div>
            </li>
            <li className="lightmode-toggle-container">
              <input
                type="checkbox"
                id="lightmode-toggle"
                onChange={() => {
                  setDarkmode(!isDarkmode);
                }}
              />
              <label htmlFor="lightmode-toggle"></label>
            </li>
          </ul>
        </section>
        <button
          className="hamburger"
          onClick={(e) => {
            if (e.target instanceof HTMLElement) {
              e.target.classList.toggle("is-active");
              if (mobileNavRef.current)
                mobileNavRef.current.classList.toggle("is-active");
            }
          }}
        >
          <div className="bar"></div>
        </button>
      </nav>
      <nav className="mobile-nav" ref={mobileNavRef}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/">Portfolio</Link>
          </li>
          <li>
            <Link to="/">About</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;