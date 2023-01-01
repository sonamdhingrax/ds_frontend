import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

function toHumanReadableDateTimeWithTimeZone(epoch_time, timezone) {
  const dateTime = moment.unix(epoch_time).format("MMMM Do YYYY, h:mm:ss a");
  return `${dateTime} ${timezone}`;
}

function toHumanReadableTime(epoch_time) {
  return moment.unix(epoch_time).format("HH:mm:ss a");
}

function App() {
  const [dateTimeInformation, setDateTimeInformation] = useState(null);

  useEffect(() => {
    async function getTimeInformation() {
      async function convertServerTime(epoch_time, time_zone) {
        const TIMEZONEDB_API_KEY = process.env.REACT_APP_TIMEZONEDB_API_KEY;
        try {
          let url = `https://api.timezonedb.com/v2.1/convert-time-zone?key=${TIMEZONEDB_API_KEY}&format=json&from=${time_zone}&to=EST&time=${epoch_time}`;
          let { data: converted_time } = await axios.get(url);
          return converted_time.toTimestamp;
        } catch (error) {
          console.error(error);
        }
      }
      try {
        let { data: time_info } = await axios.get(
          "https://api.simplifycloud.uk/time"
        );

        let eastern_time = await convertServerTime(
          time_info.server_epoch_time,
          time_info.server_time_zone
        );
        time_info["eastern_time"] = eastern_time;
        setDateTimeInformation(time_info);
      } catch (error) {
        console.error(error);
      }
    }

    getTimeInformation();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {dateTimeInformation ? (
          <p>
            Current Server Time:{" "}
            {toHumanReadableDateTimeWithTimeZone(
              dateTimeInformation.server_epoch_time,
              dateTimeInformation.server_time_zone
            )}
          </p>
        ) : (
          <p>Loading...</p>
        )}
        {dateTimeInformation ? (
          <p>
            Current Eastern Standard Time:{" "}
            {toHumanReadableTime(dateTimeInformation.eastern_time)}
          </p>
        ) : (
          <p>Loading..</p>
        )}
      </header>
    </div>
  );
}

export default App;
