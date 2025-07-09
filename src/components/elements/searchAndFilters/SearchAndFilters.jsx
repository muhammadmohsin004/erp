// components/search/SearchAndFilters.jsx
import { IoSearch } from "react-icons/io5";
import Container from "../container/Container";

const SearchAndFilters = ({
  isFocused,
  searchValue,
  setSearchValue,
  placeholder = "Search Here..",
}) => {
  return (
    <Container className="px-6 py-3 flex gap-x-3 justify-between items-center">
      <Container
        className={`border border-gray-300 bg-white flex items-center text-center py-2 px-4 rounded-md transition-all duration-300 ${
          isFocused ? "w-full" : "w-[30%]"
        }`}
      >
        <input
          type="text"
          className="border-none outline-none bg-transparent w-full text-sm text-gray-700 placeholder-gray-400"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <IoSearch className="text-gray-400" />
      </Container>
    </Container>
  );
};

export default SearchAndFilters;
