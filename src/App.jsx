import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlightTable from './FlightTable';
import FilterBar from './FilterBar';
import Pagination from './Pagination';
import './App.css';

const App = () => {
  const [flights, setFlights] = useState([]);
  const [direction, setDirection] = useState('departure');
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('flightNumber');
  const [sortDirection, setSortDirection] = useState('asc');
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
              dateStart: date,
              dateEnd: date,
            },
          }
        );

        console.log('API Response:', response.data);

        if (response.data && response.data.items) {
          const formattedFlights = response.data.items.map((item) => ({
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

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const filteredFlights = flights
    .filter((flight) =>
      flight.flightNumber.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField].localeCompare(b[sortField]);
      } else {
        return b[sortField].localeCompare(a[sortField]);
      }
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFlights.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="App">
      <FilterBar
        direction={direction}
        setDirection={setDirection}
        search={search}
        setSearch={setSearch}
        date={date}
        setDate={setDate}
      />
      <FlightTable
        flights={currentItems}
        error={error}
        handleSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default App;

// estimated_chin_start - это будет датой рейса. Сортировка и фильтрацию по всем полям в пример взять то, что есть в ui ките из райфа.
// Фильтр по дате сделать, dateStart и dateEnd. И допилить инпут рейса (поиск).
// Начало дня - start, конец - end, использовать setUTCHours, преобразовать объект date и после toISOstring.
// !!!!! ПЕРВЕСТИ В АПИ - ФЕТЧДАТА
// Алгоритм дописать в файлике тест внизу

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

// Фильтр по дате сделать, dateStart и dateEnd. И допилить инпут рейса (поиск).
// Начало дня - start, конец - end, использовать setUTCHours, преобразовать объект date и после toISOstring.
// !!!!! ПЕРВЕСТИ В АПИ - ФЕТЧДАТА
// Алгоритм дописать в файлике тест внизу

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
