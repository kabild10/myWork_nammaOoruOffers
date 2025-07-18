/* src/pages/Offers.jsx */
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { FaMapMarkerAlt, FaTags, FaSearch, FaTimes } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import useCoupon from "../../hooks/useCoupon";

/* ───── Drawer (slide-in) ───── */
const Drawer = ({
  open,
  title,
  options = [],
  selected = [],
  onSelect,
  onClose,
}) => (
  <>
    {/* overlay */}
    <div
      onClick={onClose}
      className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    />
    {/* panel */}
    <div
      className={`fixed top-16 md:top-20 right-0 z-50 h-[calc(100%-4rem)] md:h-[calc(100%-5rem)]
                  w-full max-w-xs md:w-72 bg-white shadow-lg
                  transform transition-transform duration-300
                  ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <h3 className="font-semibold text-[1rem]">{title}</h3>
        <FaTimes
          className="cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={onClose}
        />
      </div>

      <div className="p-4 overflow-y-auto space-y-2">
        {options.length === 0 ? (
          <p className="text-sm text-gray-500">No options available.</p>
        ) : (
          options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect([opt]);
                onClose();
              }}
              className={`w-full text-left px-4 py-2 rounded-md
                          ${
                            selected.includes(opt)
                              ? "bg-[#396eb2] font-medium"
                              : "hover:bg-gray-100"
                          }`}
            >
              {opt}
            </button>
          ))
        )}

        {/* Clear selection */}
        {selected.length > 0 && (
          <div className="pt-6">
            <button
              onClick={() => {
                onSelect([]);
                onClose();
              }}
              className="w-full text-sm px-4 py-2 rounded-md text-red-600 border border-red-200 hover:bg-red-50 transition"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>
    </div>
  </>
);

/* ───── Button that opens a drawer ───── */
const CustomButton = ({ label, icon, filled = false, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 justify-center h-10 w-full max-w-[190px] px-4
                rounded-md shadow-sm uppercase
                text-[0.75rem] sm:text-[0.8rem] md:text-[0.85rem]
                ${
                  filled ? "bg-[#48bfee] text-white" : "bg-white text-[#48bfee]"
                }`}
  >
    {icon} <span>{label}</span>
  </button>
);

/* ─────────────────────────────────────── */
const Offers = () => {
  const { coupons, loading, error, fetchAllCoupons } = useCoupon();

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  /* drawer visibility */
  const [isCatOpen, setCatOpen] = useState(false);
  const [isCityOpen, setCityOpen] = useState(false);

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  /* derive lists */
  useEffect(() => {
    const valid = coupons.filter((c) => typeof c === "object");
    setCategories([...new Set(valid.flatMap((c) => c.categories || []))]);
    setCities([
      ...new Set(valid.map((c) => c.store?.storeCity).filter(Boolean)),
    ]);
  }, [coupons]);

  /* filtered list */
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchCategory =
        !selectedCategory.length ||
        (c.categories || []).some((cat) => selectedCategory.includes(cat));
      const matchCity =
        !selectedCity.length || selectedCity.includes(c.store?.storeCity);
      const matchSearch = c.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchCategory && matchCity && matchSearch;
    });
  }, [coupons, selectedCategory, selectedCity, searchTerm]);

  /* badge helper */
  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate)
      return { text: "No Expiry", color: "bg-gray-300 text-gray-800" };
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.ceil((expiry - today) / 864e5);
    if (days <= 0) return { text: "Expired", color: "bg-red-100 text-red-600" };
    if (days === 1)
      return { text: "Last Day", color: "bg-orange-100 text-orange-600" };
    if (days <= 7)
      return { text: `${days}d left`, color: "bg-yellow-100 text-yellow-700" };
    return {
      text: format(expiry, "dd MMM yyyy"),
      color: "bg-green-100 text-green-700",
    };
  };

  /* shimmer card */
  const ShimmerCard = () => (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg bg-white animate-pulse">
      <div className="h-40 bg-gray-300" />
      <div className="p-4 space-y-2 bg-gray-50">
        <div className="h-5 bg-gray-300 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-300 rounded-lg mt-4" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>
          Explore Local Store Offers &amp; Coupons | Namma Ooru Offers
        </title>
        <meta
          name="description"
          content="Find and redeem exclusive coupons from trusted local stores across your city."
        />
      </Helmet>

      {/* Drawers */}
      <Drawer
        open={isCatOpen}
        title="Select Category"
        options={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        onClose={() => setCatOpen(false)}
      />
      <Drawer
        open={isCityOpen}
        title="Select Location"
        options={cities}
        selected={selectedCity}
        onSelect={setSelectedCity}
        onClose={() => setCityOpen(false)}
      />

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* filter bar */}
        <div className="flex flex-col gap-6 items-center justify-center lg:flex-row lg:justify-between mb-8">
          {/* Search Input */}
          <div className="w-full max-w-md">
            <div className="flex items-center h-10 px-4 rounded-md shadow-sm bg-white border border-white w-full">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>

          {/* Category and Location Buttons */}
          <div className="flex flex-row gap-4 w-full max-w-md justify-center">
            <CustomButton
              label="Category"
              icon={<BiSolidCategory />}
              filled
              onClick={() => setCatOpen(true)}
            />
            <CustomButton
              label="Location"
              icon={<FaMapMarkerAlt />}
              onClick={() => setCityOpen(true)}
            />
          </div>
        </div>

        {/* coupon grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : filteredCoupons.length === 0 ? (
          <p className="text-center text-gray-500">
            No matching coupons found.
          </p>
        ) : (
       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[6px]">

            {filteredCoupons.map((c) => {
              const { text: daysLeft, color } = calculateDaysLeft(c.expiryDate);
              const expired = daysLeft === "Expired";
              return (
           <div
  key={c._id} 
  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden group w-full max-w-[260px] mx-auto my-4"
>
  {/* Image Section */}
 <div className="relative overflow-hidden h-40">
  <img
    src={c.backgroundImage || "https://via.placeholder.com/400"}
    alt={c.title}
    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
    loading="lazy"
  />

    {/* Store Logo - Top Left */}
    <div className="absolute top-2 left-2 bg-white rounded-full p-1 shadow">
      <img
        src={c.store?.storeLogo || "https://via.placeholder.com/40"}
        alt="Logo"
        className="w-8 h-8 rounded-full object-cover"
        loading="lazy"
      />
    </div>

    {/* Days Left Badge - Top Right */}
    <span
      className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-semibold ${calculateDaysLeft(c.expiryDate).color}`}
    >
      {calculateDaysLeft(c.expiryDate).text}
    </span>
  </div>

 {/* Coupon Info */}
<div className="px-4 pt-3 pb-2 text-center">
  {/* Title */}
  <h2 className="text-sm font-semibold text-gray-800 truncate">
    {c.title}
  </h2>

  {/* Category + City Badges */}
  <div className="flex justify-center items-center gap-2 mt-2 flex-wrap text-xs font-medium">
    {/* Category Badge */}
    {(c.categories || []).length > 0 && (
      <span className="bg-[#e6f4fa] text-[#0075be] px-2 py-[2px] rounded-full">
        {c.categories[0]}
      </span>
    )}

    {/* City Badge */}
    {c.store?.storeCity && (
      <span className="bg-gray-100 text-gray-600 px-2 py-[2px] rounded-full">
        {c.store.storeCity}
      </span>
    )}
  </div>
</div>


  {/* View Coupon Button */}
  <div className="px-4 pb-4">
   <Link
  to={`/offersdetails/${c._id}`}
  className={`block w-full text-center px-4 py-2 text-sm font-bold rounded-lg 
    ${
      calculateDaysLeft(c.expiryDate).text === "Expired"
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-[#0075be] text-white hover:bg-white hover:text-[#0075be] hover:border hover:border-[#0075be]"
    } transition duration-200`}
>
  {calculateDaysLeft(c.expiryDate).text === "Expired"
    ? "EXPIRED"
    : "VIEW COUPON"}
</Link>

  </div>
</div>


              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Offers;
