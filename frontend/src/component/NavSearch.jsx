import React, { useState } from "react";
import SearchBar from "../component/SearchBar";
import { useNavigate } from "react-router-dom";

function NavSearch({ onSearchTodo, handleClearSearch }) { 
  const isToken = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery && typeof onSearchTodo === 'function') { 
      onSearchTodo(searchQuery);
    }
  };

  const onClearSearch = () => {
    if (typeof handleClearSearch === 'function') { 
      handleClearSearch();
    }
    setSearchQuery("");
  };

  return (
    <div className="w-[40%] bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Search Todos</h2>

      {isToken && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </>
      )}
    </div>
  );
}

export default NavSearch;
