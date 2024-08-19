import React from 'react';
import FlightRow from './FlightRow';

const FlightTable = ({
  flights,
  error,
  handleSort,
  sortField,
  sortDirection,
}) => {
  const parseDate = (dateString) => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime())
      ? 'Неверная дата'
      : parsedDate.toLocaleString();
  };

  return (
    <table>
      <thead>
        <tr>
          <th>
            Рейс
            <button onClick={() => handleSort('flightNumber')}>
              {sortField === 'flightNumber' &&
                (sortDirection === 'asc' ? '▲' : '▼')}
            </button>
          </th>
          <th>
            Авиакомпания
            <button onClick={() => handleSort('airline')}>
              {sortField === 'airline' && (sortDirection === 'asc' ? '▲' : '▼')}
            </button>
          </th>
          <th>
            Город
            <button onClick={() => handleSort('city')}>
              {sortField === 'city' && (sortDirection === 'asc' ? '▲' : '▼')}
            </button>
          </th>
          <th>
            Время
            <button onClick={() => handleSort('time')}>
              {sortField === 'time' && (sortDirection === 'asc' ? '▲' : '▼')}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {flights.length ? (
          flights.map((flight, index) => (
            <FlightRow
              key={`${flight.flightNumber}-${index}`}
              flight={flight}
              parseDate={parseDate}
            />
          ))
        ) : (
          <tr>
            <td colSpan="4">{error || 'Данные отсутствуют'}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default FlightTable;
