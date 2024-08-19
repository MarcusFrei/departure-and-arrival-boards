import React from 'react';

const FlightRow = ({ flight, parseDate }) => {
  return (
    <tr>
      <td>{flight.flightNumber}</td>
      <td>{flight.airline}</td>
      <td>{flight.city}</td>
      <td>{parseDate(flight.time)}</td>
    </tr>
  );
};

export default FlightRow;
