const Sidebar = ({ filters, setFilters }) => {
    const toggleType = (type) => {
      setFilters((prev) => ({ ...prev, types: { ...prev.types, [type]: !prev.types[type] } }));
    };
    const toggleLocation = (location) => {
      setFilters((prev) => ({ ...prev, locations: { ...prev.locations, [location]: !prev.locations[location] } }));
    };
  
    return (
      <aside className="sticky top-4 h-max w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <p className="mt-1 text-sm text-gray-500">Only open jobs are shown</p>
  
        <div className="mt-5">
          <h3 className="text-sm font-medium text-gray-900">Job Type</h3>
          <div className="mt-3 space-y-2">
            {['Full-time', 'Part-time', 'Contract'].map((type) => (
              <label key={type} className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={filters.types[type]}
                  onChange={() => toggleType(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
  
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Location</h3>
          <div className="mt-3 space-y-2">
            {['Remote', 'Bengaluru', 'Delhi', 'Mumbai', 'Hyderabad', 'Pune', 'Noida', 'Chennai'].map((loc) => (
              <label key={loc} className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={filters.locations[loc]}
                  onChange={() => toggleLocation(loc)}
                />
                {loc}
              </label>
            ))}
          </div>
        </div>
  
        <div className="mt-6">
          <button className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200" onClick={() => setFilters({ types: {}, locations: {} })}>
            Clear Filters
          </button>
        </div>
      </aside>
    );
  };

  export default Sidebar;