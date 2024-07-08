
import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

function SearchBar({ value, onChange, handleSearch, onClearSearch }) {
  return (
    <div className="w-80 flex items-center px4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search Todo"
        className="w-full text-xs bg-transparent py-[15px] outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <IoMdClose
          className="text-slate-500 cursor-pointer hover:text-black"
          onClick={onClearSearch}
        />
      )}
      <FaMagnifyingGlass
        className="text-slate-500 cursor-pointer hover:text-black "
        onClick={handleSearch}
      />
    </div>
  );
}

export default SearchBar;
