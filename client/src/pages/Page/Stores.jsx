import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../../hooks/useStore";

const Stores = () => {
  const { stores, loading, error, fetchAllStores } = useStore();

  useEffect(() => {
    fetchAllStores();
  }, [fetchAllStores]);

  const SkeletonCard = () => (
    <div className="relative h-64 rounded-2xl overflow-hidden shadow-md animate-pulse bg-gray-200">
      <div className="absolute bottom-4 left-4">
        <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Explore Our Featured Stores
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Discover handpicked stores offering exciting deals and local experiences.
        </p>
      </div>

      {/* ✅ Show 1, 2, 3, or 4 cards per row depending on screen size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, idx) => <SkeletonCard key={idx} />)
          : stores?.length > 0 ? (
              stores.map((store) => (
                <div
                  key={store._id}
                  className="bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden group"
                >
                  {/* Image with Zoom + Badges */}
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={store.storeLogo || "https://via.placeholder.com/400"}
                      alt={store.storeName}
                      className="w-full h-full object-cover transform transition-transform shadow-amber-50   duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* New Badge - Top Left */}
                    <span className="absolute top-2 left-2 bg-[#0075be] text-white text-[10px] font-semibold px-2 py-[2px] rounded-full shadow">
                      New
                    </span>

                    {/* Rating Badge - Top Right */}
                    <div className="absolute top-2 right-2 bg-white text-gray-800 text-[10px] font-semibold px-2 py-[2px] rounded-full shadow flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.954L10 0l2.95 5.956 6.562.954-4.756 4.635 1.122 6.545z" />
                      </svg>
                      <span>{store.rating || "4.5"}</span>
                    </div>
                  </div>

                  {/* Store Info */}
                  <div className="px-3 pt-2 pb-1 text-center">
                    <h2 className="text-sm font-semibold text-gray-800 truncate">{store.storeName}</h2>
                    <p className="text-xs text-gray-500">{store.storeCity}</p>
                   
                  </div>

                  {/* View Store Button */}
                  <div className="px-3 pb-3 mt-1">
                   <Link
  to={`/store/${store._id}`}
  className="block w-full text-center px-5 py-3 text-sm font-bold rounded-lg 
           bg-[#0075be] text-white transition-colors duration-200 
           hover:bg-white hover:text-[#0075be] hover:border hover:border-[#0075be]">
  VIEW STORE
</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-12">
                No stores available at the moment.
              </div>
            )}
      </div>
    </div>
  );
};

export default Stores;
