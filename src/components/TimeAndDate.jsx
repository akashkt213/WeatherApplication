import React from "react";
import { formatToLocalTime } from "../services/WeatherServices";

function TimeAndDate({ weather: { dt, timezone, name, country } }) {
  return (
    <div>
      <div className="flex items-center justify-center my-6">
        <p className="text-white font-extralight text-xl">
          {formatToLocalTime(dt, timezone)}
        </p>
      </div>
      <div className="flex items-center justify-center my-3">
        <p className="text-white font-semibold text-3xl">{`${name}, ${country}`}</p>
      </div>
    </div>
  );
}

export default TimeAndDate;