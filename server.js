const express = require('express');
const axios = require('axios');
const env = require('process-env');
const cors = require('cors');
const DarkSky = require('dark-sky');
const darksky = new DarkSky(process.env.DARKSKIES);

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors())
app.use(express.json());

let temp = '';
let long;
let lat;
let city = '';
let summary = '';


app.post('/post', async (req, res)  =>   {
    city =  await req.body.city
    await axios.get(`http://open.mapquestapi.com/geocoding/v1/address?key=${process.env.MAP}&location=${city}`)
    .then(response => {
        lat = response.data['results'][0].locations[0].latLng.lat;
        long = response.data['results'][0].locations[0].latLng.lng;
    })
    .catch(error => {
        console.log(error);
    });
darksky
    .options({
        latitude: lat,
        longitude: long,
        language: 'en',
        extendHourly: true
    })
    .get()
    .then(data => {
        weather = data
        temp = weather.currently.temperature;
        summary = weather.currently.summary
        res.send({"city": temp, "summary": summary});

    })
})

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`)
   
})