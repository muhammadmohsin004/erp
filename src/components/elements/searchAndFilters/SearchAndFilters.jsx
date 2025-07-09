/* eslint-disable react/prop-types */
import { IoSearch } from "react-icons/io5";
import Container from "../container/Container";

const SearchAndFilters = ({
  isFocused,
  setIsFocused,
  searchValue,
  setSearchValue,
}) => {
  return (
    <Container className="px-6 py-3 flex gap-x-3 justify-between items-center">
      <Container
        className={`border-[1px] border-white bg-white flex justify-center items-center text-center py-2 px-4 rounded-md transition-all duration-300 ${
          isFocused ? "w-full" : "w-[30%]"
        }`}
      >
        <input
          type="text"
          className="border-none outline-none bg-transparent w-full text-sm"
          placeholder="Search Here.."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />

        <IoSearch className="text-primary" />
      </Container>
    </Container>
  );
};

export default SearchAndFilters;
