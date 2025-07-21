// components/search/SearchAndFilters.jsx
import { IoSearch } from "react-icons/io5";
import Container from "../container/Container";
import Select from "./Select"; // You'll need a Select component for the filters

const SearchAndFilters = ({
  searchPlaceholder = "Search Here..",
  onSearch,
  searchValue,
  filters = [],
}) => {
  return (
    <Container className="flex flex-col md:flex-row  items-center">
      {/* Search Input */}
      <Container
        className={`border border-gray-300 bg-white flex items-center py-2 px-4 rounded-md w-full md:w-auto`}
      >
        <input
          type="text"
          className="border-none outline-none bg-transparent w-full text-sm text-gray-700 placeholder-gray-400"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearch}
        />
        <IoSearch className="text-gray-400" />
      </Container>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {filters.map((filter, index) => (
            <Select
              key={index}
              label={filter.label}
              options={filter.options}
              value={filter.value}
              onChange={filter.onChange}
              className="min-w-[150px]"
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default SearchAndFilters;