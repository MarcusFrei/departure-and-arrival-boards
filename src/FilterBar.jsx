import React from 'react';

const FilterBar = ({ setDirection, search, setSearch, date, setDate }) => {
  return (
    <div className="filters">
      <button onClick={() => setDirection('departure')}>Вылет</button>
      <button onClick={() => setDirection('arrival')}>Прилёт</button>
      <input
        type="text"
        placeholder="Номер рейса"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>
  );
};

export default FilterBar;
