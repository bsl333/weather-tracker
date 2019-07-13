### Purpose
Capture and store (in memory) measurement data sent from a Raspberry Pi.

### Getting started
To install dependencies

    npm install

To run the test suite

    npm test

Test output is written to both `stdout` and `integration-test.log`

To run the app:

    npm start

### Developer mode
To rebuild project after any changes are saved:

    npm run dev

### API Documentation
See and run examples via **[Postman Docs](https://documenter.getpostman.com/view/623338/SVSGQBKM)**
You can also find the Postman Collection in the postman directory.
To open, open postman, import the collection and environemt and make sure set the environment variable to "capital-one-weather-tracker-local-dev". Then you can run the examples locally.

Exposed API routes:
| Method | Path                     | function                                       | Notes                                                                                              |
|--------|--------------------------|------------------------------------------------|----------------------------------------------------------------------------------------------------|
| POST   | /measurements            | post a new measurement                         | metric values (excluding timestamp) must be numbers (Raspberry Pi sends as floating-point decimal) |
| GET    | /measurements/:timestamp | retreive a single measurement                  | timestamp type: DateTime in UTC ISO-8061 format                                                    |
| GET    | /stats?<params>          | perform statistical analysis over a date range | params can take on the following values (see below)                                                |
**<params>**
| Query Param  | Meaning                                    | Values Supported                                                                 |
|--------------|--------------------------------------------|----------------------------------------------------------------------------------|
| stat         | stat value to perform group of metrics     | min, max, or average (can be repeated for multiple statistics)                   |
| metric       | mertric to perfrom statistical analysis on | See additional notes for values supported (can be repeated for multiple metrics) |
| fromDateTime | start date                                 | DateTime in UTC ISO-8061 format                                                  |
| toDateTime   | end date                                   | DateTime in UTC ISO-8061 format                                                  |

#### Additional Notes:
Raspberry Pi currently sends the following data, but API is built to handle new data as well.
| Metric Name   | Type     | Example                    | Notes                                    |
|---------------|----------|----------------------------|------------------------------------------|
| timestamp     | DateTime | "2019-07-12T07:32:03.453Z" | Always sent as an ISO-8061 string in UTC |
| temperature   | float    | 22.4                       | in ° C                                   |
| dewPoint      | float    | 18.6                       | in ° C                                   |
| precipitation | float    | 142.2                      | in mm                                    |