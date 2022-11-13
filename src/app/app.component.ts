import { Component, OnInit } from '@angular/core';
import * as fontawesome from '@fortawesome/free-solid-svg-icons'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  icons = {
    faCloudMoon: fontawesome.faCloudMoon,
    faCloudMoonRain: fontawesome.faCloudMoonRain,
    faCloud: fontawesome.faCloud,
    faArrowUp: fontawesome.faArrowUp,
    faArrowDown: fontawesome.faArrowDown,
    faMagnifyingGlass: fontawesome.faMagnifyingGlass
  }

  weatherData: any

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
    } else {alert("Ops! Seu navegador não tem suporte para esta merda.")}
  }


  getWeatherDataGeo(userLat: any, userLon: any){
    this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=c027ff71441a14766a6b79b9be8c447e`)
    .subscribe(
      data => {this.setWeatherDataGeo(data)}
      )
  }

  setWeatherDataGeo(data: any){
    this.weatherData = data
    let fahrenheit = 273.15
    let currentDate = new Date()
    let sunset = new Date(this.weatherData.sys.sunset * 1000)

    this.weatherData.sunsetTime = sunset
    this.weatherData.cityName = (this.weatherData.name)
    this.weatherData.countryCod = (this.weatherData.sys.country)
    this.weatherData.isDay = (currentDate.getTime() < sunset.getTime())
    this.weatherData.temp = (this.weatherData.main.temp - fahrenheit).toFixed(0)
    this.weatherData.tempMax = (this.weatherData.main.temp_max - fahrenheit).toFixed(0)
    this.weatherData.tempMin = (this.weatherData.main.temp_min - fahrenheit).toFixed(0)
    this.weatherData.tempFeelsLike = (this.weatherData.main.feels_like - fahrenheit).toFixed(0)
    this.weatherData.tempHumidity = (this.weatherData.main.humidity)

    console.log(data)
  }

  getWeatherDataLocation(cidade: any){
    this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=c027ff71441a14766a6b79b9be8c447e`)
    .subscribe(
      data => {this.setWeatherDataLocation(data)}
      )
  }

  setWeatherDataLocation(data: any){
    this.weatherData = data
    let currentDate = new Date()
    let sunset = new Date(this.weatherData.sys.sunset * 1000)

    this.weatherData.sunsetTime = sunset
    this.weatherData.cityName = (this.weatherData.name)
    this.weatherData.countryCod = (this.weatherData.sys.country)
    this.weatherData.isDay = (currentDate.getTime() < sunset.getTime())
    this.weatherData.temp = (this.weatherData.main.temp).toFixed(0)
    this.weatherData.tempMax = (this.weatherData.main.temp_max).toFixed(0)
    this.weatherData.tempMin = (this.weatherData.main.temp_min).toFixed(0)
    this.weatherData.tempFeelsLike = (this.weatherData.main.feels_like).toFixed(0)
    this.weatherData.tempHumidity = (this.weatherData.main.humidity)

    console.log(data)
  }

  search($event: any){
    let cidade = $event.target.value

    this.getWeatherDataLocation(cidade)
  }
}