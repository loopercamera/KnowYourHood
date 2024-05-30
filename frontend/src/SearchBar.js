import React, { useRef, useEffect } from 'react';
import SearchNominatim from 'ol-ext/control/SearchNominatim';
import './SearchBar.css';

const SearchBar = ({ map, searchField, setCenterCoordinate }) => {
  const searchRef = useRef(null);
  const searchControlRef = useRef(null);

  useEffect(() => {
    if (map && !searchControlRef.current) {
      const searchControl = new SearchNominatim({
        target: searchRef.current,
        onselect: ({ coordinate }) => {
          console.log(coordinate);
          setCenterCoordinate(coordinate);
        },
      });
      map.addControl(searchControl);
      searchControlRef.current = searchControl;
    }

    return () => {
      if (map && searchControlRef.current) {
        searchControlRef.current.setTarget(null);
      }
    };
  }, [map, setCenterCoordinate]);

  return (
    <div>
      {searchField}
      <div className="search-results" ref={searchRef} />
    </div>
  );
};

export default SearchBar;
