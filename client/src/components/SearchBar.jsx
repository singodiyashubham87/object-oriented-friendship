const SearchBar = ({
  value,
  onChange,
  placeholder = "Search by name...",
  className = "",
}) => {
  return (
    <div className={`w-44 sm:w-48 md:w-56 lg:w-64 ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm bg-dark-glassmorphism-30 border border-secondary-silver rounded-lg text-primary-silver placeholder-secondary-silver focus:outline-none focus:border-primary-silver transition-colors"
      />
    </div>
  );
};

export default SearchBar;
