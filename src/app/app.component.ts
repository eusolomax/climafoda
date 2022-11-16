import { Component, OnInit } from '@angular/core';
import * as fontawesome from '@fortawesome/free-solid-svg-icons'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  icons = {
    faSun: fontawesome.faSun,
    faCloudSun: fontawesome.faCloudSun,
    faCloudSunRain: fontawesome.faCloudSunRain,

    faMoon: fontawesome.faMoon,
    faCloudMoon: fontawesome.faCloudMoon,
    faCloudMoonRain: fontawesome.faCloudMoonRain,
    faThunderstorm: fontawesome.faThunderstorm,

    faDefault: fontawesome.faDroplet,

    faArrowUp: fontawesome.faArrowUp,
    faArrowDown: fontawesome.faArrowDown,
    faMagnifyingGlass: fontawesome.faMagnifyingGlass
  }

  weatherData: any
  searchError: boolean = false
  clouds: boolean = false
  clear: boolean = false
  rain: boolean = false
  thunderstorm: boolean = false
  mist: boolean = false
  haze: boolean = false

  iconValue: any = this.icons.faDefault

  constructor(private http: HttpClient){}

  ngOnInit(){
    this.getData()
  }

  getData(){
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos => {
        let userLat = pos.coords.latitude
        let userLon = pos.coords.longitude
        console.log(userLat, userLon)

        this.getWeatherDataGeo(userLat, userLon)
      })
    } else {alert("Ops! Seu navegador não tem suporte para este recurso. Use o serviço de busca.")}
  }

  getWeatherDataGeo(userLat: any, userLon: any){
    this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=c027ff71441a14766a6b79b9be8c447e`)
    .subscribe(
      data => {this.setWeatherDataGeo(data)}
      )
  }

  setWeatherDataGeo(data: any){
    this.resetCond()
    let fahrenheit = 273.15
    this.weatherData = data

    this.weatherData.isDay = (this.weatherData.weather[0].icon.split("").includes("d"))
    this.weatherData.weatherCond = (this.weatherData.weather[0].main)
    this.weatherData.cityName = (this.weatherData.name)
    this.weatherData.countryCod = (this.weatherData.sys.country)
    this.weatherData.temp = (this.weatherData.main.temp - fahrenheit).toFixed(0)
    this.weatherData.tempMax = (this.weatherData.main.temp_max - fahrenheit).toFixed(0)
    this.weatherData.tempMin = (this.weatherData.main.temp_min - fahrenheit).toFixed(0)
    this.weatherData.tempFeelsLike = (this.weatherData.main.feels_like - fahrenheit).toFixed(0)
    this.weatherData.tempHumidity = (this.weatherData.main.humidity)

    this.checkCond(this.weatherData.weatherCond)
    this.checkIcon()
    
    console.log(data)
    console.info(this.weatherData.isDay, this.weatherData.weatherCond)
  }

  getWeatherDataLocation(cidade: any){
    this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=c027ff71441a14766a6b79b9be8c447e`)
    .subscribe({
      next: data => {this.setWeatherDataLocation(data)},

      error: err => {
      switch(err.error.cod) {
        case "404":
          this.searchError = true
          setTimeout(() => {
            this.searchError = false
          }, 1000);
          break

        case "400":
          alert("Insira uma localidade")
      }
      }
    })
  }

  setWeatherDataLocation(data: any){
    this.resetCond()
    this.weatherData = data

    this.weatherData.isDay = (this.weatherData.weather[0].icon.split("").includes("d"))
    this.weatherData.weatherCond = (this.weatherData.weather[0].main)
    this.weatherData.cityName = (this.weatherData.name)
    this.weatherData.countryCod = (this.weatherData.sys.country)
    this.weatherData.temp = (this.weatherData.main.temp).toFixed(0)
    this.weatherData.tempMax = (this.weatherData.main.temp_max).toFixed(0)
    this.weatherData.tempMin = (this.weatherData.main.temp_min).toFixed(0)
    this.weatherData.tempFeelsLike = (this.weatherData.main.feels_like).toFixed(0)
    this.weatherData.tempHumidity = (this.weatherData.main.humidity)

    this.checkCond(this.weatherData.weatherCond)
    this.checkIcon()

    console.log(data)
    console.info(this.weatherData.weather[0].description)
  }

  search($event: any){
    let cidade = $event.target.value

    this.getWeatherDataLocation(cidade)
  }

  checkCond(weather: any){
    switch (weather) {
      case "Clouds":
        this.clouds = true
        break
      case "Rain":
        this.rain = true
        break
      case "Clear":
        this.clear = true
        break
      case "Thunderstorm":
        this.thunderstorm = true
        break
      case "Mist":
        this.mist = true
        break
      case "Haze":
        this.haze = true
      }
  }

  checkIcon(){
    if (this.weatherData.isDay == true && this.clear == true) {
      this.iconValue = this.icons.faSun
    }

    if (this.weatherData.isDay == true && this.clouds == true) {
      this.iconValue = this.icons.faCloudSun
    }

    if (this.weatherData.isDay == true && this.rain == true) {
      this.iconValue = this.icons.faCloudSunRain
    }

    if (this.weatherData.isDay == true && this.thunderstorm == true) {
      this.iconValue = this.icons.faCloudSunRain
    }

    if (this.weatherData.isDay == true && this.mist == true) {
      this.iconValue = this.icons.faCloudSun
    }

    if (this.weatherData.isDay == true && this.haze == true) {
      this.iconValue = this.icons.faCloudSun
    }

    if (this.weatherData.isDay == false && this.clear == true) {
      this.iconValue = this.icons.faMoon
    }

    if (this.weatherData.isDay == false && this.clouds == true) {
      this.iconValue = this.icons.faCloudMoon
    }

    if (this.weatherData.isDay == false && this.rain == true) {
      this.iconValue = this.icons.faCloudMoonRain
    }

    if (this.weatherData.isDay == false && this.thunderstorm == true) {
      this.iconValue = this.icons.faCloudMoonRain
    }

    if (this.weatherData.isDay == false && this.mist == true) {
      this.iconValue = this.icons.faCloudMoon
    }

    if (this.weatherData.isDay == false && this.haze == true) {
      this.iconValue = this.icons.faCloudMoon
    }
  }

  resetCond(){
    this.iconValue = this.icons.faDefault
    this.clouds = false
    this.clear = false
    this.rain = false
    this.thunderstorm = false
    this.mist = false
    this.haze = false
  }
}