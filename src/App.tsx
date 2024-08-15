import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  city: string;
  time: string;
}

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [direction, setDirection] = useState('departure');
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('flightNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get(
          'https://www.svo.aero/bitrix/timetable/',
          {
            params: {
              direction,
              locale: 'ru',
              from: date,
              to: date,
            },
          }
        );

        console.log('API Response:', response.data);

        if (response.data && response.data.items) {
          const formattedFlights = response.data.items.map((item: any) => ({
            id: item.i_id,
            flightNumber: item.flt,
            airline: item.co.name,
            city: direction === 'departure' ? item.mar2.city : item.mar1.city,
            time:
              direction === 'departure'
                ? item.mar2.at || item.estimated_chin_start
                : item.mar1.dt || item.estimated_chin_start,
          }));
          setFlights(formattedFlights);
          setError(null);
        } else {
          setFlights([]);
          setError('Ответ от API не содержит ожидаемые данные.');
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        setFlights([]);
        setError('Произошла ошибка при запросе данных.');
      }
    };

    fetchFlights();
  }, [direction, date]);

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const parseDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime())
      ? 'Неверная дата'
      : parsedDate.toLocaleString();
  };

  const filteredFlights = flights
    .filter((flight) =>
      flight.flightNumber.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField as keyof Flight].localeCompare(
          b[sortField as keyof Flight]
        );
      } else {
        return b[sortField as keyof Flight].localeCompare(
          a[sortField as keyof Flight]
        );
      }
    });

  console.log('Filtered Flights:', filteredFlights);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFlights.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="App">
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
                {sortField === 'airline' &&
                  (sortDirection === 'asc' ? '▲' : '▼')}
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
          {currentItems.length ? (
            currentItems.map((flight, index) => (
              <tr key={`${flight.flightNumber}-${index}`}>
                <td>{flight.flightNumber}</td>
                <td>{flight.airline}</td>
                <td>{flight.city}</td>
                <td>{parseDate(flight.time)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">{error || 'Данные отсутствуют'}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Назад
        </button>
        <span>
          Страница {currentPage} из {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default App;

// estimated_chin_start - это будет датой рейса. Сортировка и фильтрацию по всем полям в пример взять то, что есть в ui ките из райфа.
// Фильтр по дате сделать, dateStart и dateEnd. И допилить инпут рейса (поиск).
// 67, 68

// function countVowels(str) {
//   console.log(str);

//   const vowels = 'aeious';

//   str = str.toLowerCase();
//   let count = 0;
//   for (let char of str) {
//     if (vowels.includes(char)) {
//       count++;
//     }
//   }
//   return count;
// }

// console.log(countVowels('Hi, WOrld!'));

// function lengthOfLongestSubstring(s) {
//   let maxLength = 0;
//   let start = 0;
//   let charMap = new Map();

//   for (let i = 0; i < s.length; i++) {
//     const char = s[i];
//     if (charMap.has(char) && charMap.get(char) >= start) {
//       start = charMap.get(char) + 1;
//     }
//     charMap.set(char, i);
//     maxLength = Math.max(maxLength, i - start + 1);
//   }
//   return maxLength;
// }

// console.log(lengthOfLongestSubstring('abcabcbb'));
// console.log(lengthOfLongestSubstring('accddbbbb '));

// Алгоритм Кадана
// function maxSubbaraySum(nums) {
//   let maxSum = nums[0];
//   let currentSum = nums[0];

//   for (let i = 1; i < nums.length; i++) {
//     currentSum = Math.max(nums[i], currentSum + nums[i]);
//     maxSum = Math.max(maxSum, currentSum);
//   }
//   return maxSum;
// }

// console.log(maxSubbaraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));

// function sortByFrequency(str) {
//   let charCount = {};
//   for (let char of str) {
//     charCount[char] = (charCount[char] || 0) + 1;
//   }

//   let charArray = Object.entries(charCount);
//   charArray.sort((a, b) => b[1] - a[1]);
//   let result = '';
//   for (let [char, freq] of charArray) {
//     result += char.repeat(freq);
//   }
//   return result;
// }

// console.log(sortByFrequency('Молоко'));
