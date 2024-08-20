import { useRef, useState } from "react";

export default function SearchableList({ items, itemKeyFn, children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const lastSearch = useRef();
  const searchResult = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
  );
  function handleSearch(event) {
    //debouncing
    if (lastSearch.current) {
      //timer cancel if start typing again
      clearTimeout(lastSearch.current);
    }

    lastSearch.current = setTimeout(() => {
      lastSearch.current = null; //resetting timer id if timer expire user do not type
      setSearchTerm(event.target.value);
    }, 500);
  }
  //if we just use children then it is render functio, it evaluates and return some JSX value
  return (
    <div className="searchable-list">
      <input type="search" placeholder="search" onChange={handleSearch} />
      <ul>
        {searchResult.map((item, index) => (
          <li key={itemKeyFn(item)}>{children(item)}</li>
        ))}
      </ul>
    </div>
  );
}
