import { DateTime } from "luxon";

//      ****** One Call API ******
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

//      ****** normal weather API ******
// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

// now till 2.5 both url are same so we used it into the BASE_URL .The remaining part will be passed as parameter

const API_KEY = "b9e633f626334b7ad24263e3a6510e81";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// here we will fetch the weather details.    infoType is the parameter where we will pass whether its 'onecall' or 'weather'
const getWeatherData = async (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url).then((res) => res.json());
};

const formatForecastWeather = (data) => {
  // getting the daily and hourly weather
  let { timezone, daily, hourly } = data;
  // slice(1,6) becoz we need weather for next 5 days and from tomorrow.
  daily = daily.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].icon,
    };
  });
  hourly = hourly.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
      temp: d.temp,
      icon: d.weather[0].icon,
    };
  });

  return { timezone, daily, hourly };
};

// here we are destructuring the data that we got.
const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, temp_min, temp_max, humidity, feels_like },
    wind: { speed },
    dt,
    name,
    weather,
    sys: { country, sunrise, sunset },
  } = data;

  // getting the details and icon from weather array
  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    temp_min,
    temp_max,
    humidity,
    feels_like,
    speed,
    dt,
    name,
    details,
    icon,
    country,
    sunrise,
    sunset,
  };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
    // here the fetched result is stored in data and sent to formatCurrentWeather function for the
    // structuring of the details
  ).then((data) => formatCurrentWeather(data));

  // from the formattedCurrentWeather we extract latitude and longitude.
  const { lat, lon } = formattedCurrentWeather;

  // then for getting the hourly and daily details we pass the lat and lon and call the onecall api .
  const formattedForecastWeather = await getWeatherData("onecall", {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  }).then((data) => formatForecastWeather(data));

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

// for retreiving the images using the code
const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode };
