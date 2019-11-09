import React, { useState, useEffect} from 'react';
import './App.css';
import axios from 'axios'




//// TODO:
/*
Call weather promise from inside button onclick, and use that to setState of a weather object to be passed to
the weather render component
*/



const Input = (props) => {
  return(
    <div>
    Enter country name: <input type='text' value={props.filter} onChange={props.getCountry} ></input>
    </div>
  )
}




const Countries = (props) => {
  //console.log("Countries: ",props.Countries)
  if(props.Countries.length===1){


    const country=props.Countries[0]
    const languages=country.languages



    return(
      <div>
      <h1>{country.name}</h1>
      Capital: {country.capital}<br></br>
      Population: {country.population}<br></br>
      <h2>Languages</h2>
      <ul>
      {languages.map((language) =>
        <li key={language.name}>{language.name}</li>
      )}
      </ul>
      <div margin-left="300px" >
      <img src={country.flag} width="200" alt=''></img>
      </div>
      </div>
    )
  }else if(props.Countries.length<=10){

    return (
      <>
      Countries:
      {props.Countries.map(country => (
        <div key={country.name} >

        {country.name}
        <button onClick={() => {props.setCountry(country.name)}} value={country.name}>select</button>

        </div>
      ))}
      </>
    )
  }else{
    return(
      <div>
      Too many results, restrict search
      </div>
    )
  }

}


/**
** API call for weather for a city
** api.openweathermap.org/data/2.5/weather?q={city name},{country code}
** city name, ISO1366 country code, {country.alpha3Code} is sufficient for alpha3Code
** {country.capital}
**
**  For icon URL
**  http://openweathermap.org/img/wn/10d@2x.png
**  where @2x is scale multiplier

    weather.main.temp is in kelvin
      -274 to get C


    weather.weather.descripton is string description
    weather.weather.icon is icon to pull
    weather.weather.main Main weather description("Clouds","Raining")

    weather.wind.speed wind speed meters/s
    weather.wind.deg wind degrees, meteorological




**/



const ShowWeather = (props) => {
  const [weather,setWeather] = useState(null)
  var country=props.country
  //console.log("calling weather")
  //console.log(country)


  const apiKey='&appid='

  const apiCall='https://api.openweathermap.org/data/2.5/weather?q='+country.capital+','+country.alpha3Code+apiKey
  //console.log(apiCall)
  useEffect(()=>{
    axios
      .get(apiCall)
      .then(response => {
        setWeather(response.data)
      })

  },[apiCall])


  //console.log('Output: ',weather)
  if(weather===null){
    return(
      <>
      No weather information loaded...
      </>
    )
  }else{
    const scale=''
    const weatherIcon = 'https://openweathermap.org/img/wn/'+weather.weather[0].icon+scale+'.png'
    //console.log(weatherIcon)
    //console.log(scale)
    return(
      <>
      <h2>Weather in {country.capital}</h2>
      <h3>Description: </h3>{weather.weather[0].description}
      <h3>Temperature: </h3>{Math.round((weather.main.temp-274)*10)/10}C<br></br>
      <img src={weatherIcon} alt=''></img>
      <h3>Wind: </h3>{weather.wind.speed}m/s at {weather.wind.deg} degrees
      </>
    )
  }

}

const Weather = (props) => {
  //console.log("Weather: ",props)
  //Open weather map
  if(props.countries.length===1){
    return(
      <>
      <ShowWeather country={props.countries[0]} />
      </>
    )
  }else{

    return(
      <>
      </>
    )
}


}







const App = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [filter, setFilter] = useState('')


  const hook = () => {
    //console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        //console.log('promise fulfilled')
        setCountries(response.data)
        setFilteredCountries(response.data)
        //console.log(response.data)
      })
  }
  useEffect(hook, [])


  const setCountry = (props) => {
    //event.preventDefault()
    //console.log(props)
    filterCountries(props)

  }


  //filter function to get Country by name
  const getCountries = (event) => {
    //console.log(event.target.value)
    filterCountries(event.target.value)

  }
  //need to check input so RegExp doesn't break
  const filterCountries = (input) => {
    var filteredOutput = [];
    var country;
    for(country of countries){
      if(country.name.toLowerCase().indexOf(input.toLowerCase()) !== -1){
        filteredOutput=filteredOutput.concat(country)
      }
    }


    setFilteredCountries(filteredOutput)
    setFilter(input)
  }


  return(
    <div>
    <Input getCountry={getCountries} filter={filter}/>
    <Countries Countries={filteredCountries} setCountry={setCountry} />
    <Weather countries={filteredCountries} />
    </div>
  )
}


export default App;
