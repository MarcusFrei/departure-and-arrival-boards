import axios from 'axios';

const API_URL = 'https://www.svo.aero/bitrix/timetable/';

export const fetchFlights = async (direction, date) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        direction,
        locale: 'ru',
        dateStart: date,
        dateEnd: date,
      },
    });

    if (response.data && response.data.items) {
      return response.data.items;
    } else {
      throw new Error('Ответ от API не содержит ожидаемые данные.');
    }
  } catch (error) {
    throw new Error('Произошла ошибка при запросе данных: ' + error.message);
  }
};
