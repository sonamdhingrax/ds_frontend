import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios"; //Library used to mape api calls
import moment from "moment"; //Library used to format time and date

/*  Function to convert epoch time to Human Readable Date time timezone
    in Month Date Year, Hours Minutes Seconds am/pm Timezone format
    eg: Input  = 1672654956
        Output = January 2nd 2023, 10:22:36 UTC
*/
function toHumanReadableDateTimeWithTimeZone(epoch_time, timezone) {
  const dateTime = moment.unix(epoch_time).format("MMMM Do YYYY, HH:mm:ss");
  return `${dateTime} ${timezone}`;
}

/*  Function to convert epoch time to Human Readable Time
    in Hours Minutes Seconds format
    eg: Input  = 1672654956
        Output = 10:22:36
*/
function toHumanReadableTime(epoch_time) {
  return moment.unix(epoch_time).format("HH:mm:ss");
}

//This is the exported function for this App.js file
function App() {
  // State Declaration
  const [dateTimeInformation, setDateTimeInformation] = useState(null);

  // Load the components once when the page is rendered.
  useEffect(() => {
    // Function to get time Information from the backend created by the python code
    // in the ds_backend repository
    async function getTimeInformation() {
      // Function to convert timezone using TIMEZONEDB api service
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
          "https://api.simplifycloud.uk/time" //backend Url for fetching server time and timezone
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
        <h1>This is the rc branch. This is built now.</h1>
        <img src={logo} className="App-logo" alt="logo" />
        {/* Check if date and time information has been fetched */}
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
        {/* Check if time conversion information has been fetched from TIMEZONEDB service */}
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
