import { Component, OnInit, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import * as fontawesome from '@fortawesome/free-solid-svg-icons'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @ViewChild("searchInput") searchInput: any
  @ViewChild("hamburgerDiv") hamburgerDiv: any
  @ViewChild("musicplayer") musicplayer: any
  @ViewChild("musicplayerRange") musicplayerRange: any

  icons = {
    faSun: fontawesome.faSun,
    faCloudSun: fontawesome.faCloudSun,
    faCloudSunRain: fontawesome.faCloudSunRain,

    faMoon: fontawesome.faMoon,
    faCloudMoon: fontawesome.faCloudMoon,
    faCloudMoonRain: fontawesome.faCloudMoonRain,
    faThunderstorm: fontawesome.faThunderstorm,

    faDefault: fontawesome.faDroplet,
    faBookmark: fontawesome.faBookmark,
    faCheck: fontawesome.faCheck,
    faBars: fontawesome.faBars,
    faLocationDot: fontawesome.faLocationDot,
    faBook: fontawesome.faBook,
    faHeart: fontawesome.faHeart,

    faArrowUp: fontawesome.faArrowUp,
    faArrowDown: fontawesome.faArrowDown,
    faMagnifyingGlass: fontawesome.faMagnifyingGlass,
    faPlay: fontawesome.faPlay,
    faPause: fontawesome.faPause,
    faVolumeHigh: fontawesome.faVolumeHigh,
    faVolumeMute: fontawesome.faVolumeMute
  }

  weatherData: any
  searchError: boolean = false
  clouds: boolean = false
  clear: boolean = false
  rain: boolean = false
  thunderstorm: boolean = false
  mist: boolean = false
  haze: boolean = false
  snow: boolean = false
  smoke: boolean = false

  description: string = "Carregando.."
  userHasGeo: boolean = false
  
  iconValue: any = this.icons.faDefault
  bookMarkIcon: any = this.icons.faBookmark
  LocalContainsBookMark: boolean = false
  WebsiteContainsBookMark: boolean = false
  iconVolume: any = this.icons.faVolumeHigh
  hasVolume: any = false

  hambugerOpened: boolean = false
  isPlaying: boolean = false
  mediaplayerPlayIcon = this.icons.faPlay
  musicplayerDuration: any
  htmlFullLengthAudio: any
  htmlElapseLengthAudio: any

  constructor(private http: HttpClient){}

  ngOnInit(){
    let that = this
    let isAlpha = (ch: any) => {
      return typeof ch === "string" && ch.length === 1
             && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
    }
    
    this.getData()
    this.checkBookmark()

    document.addEventListener("keypress", function(event){
      if (isAlpha(event.key)){
        that.searchInput.nativeElement.focus()
      }
    })
  }

  ngAfterViewChecked(){
    this.checkBookmark()
  }
  
  joemama(value: number) {
    let sideA = Math.floor(value / 60)
    let converting = value % 60
    let sideB

    if (converting < 10){
      sideB = converting.toString().padStart(2, '0')
    } else {
      sideB = converting
    }

    return `${sideA}:${sideB}`
  }

  ngAfterViewInit() {
    this.musicplayerRange.nativeElement.max = Math.floor(this.musicplayer.nativeElement.duration)
    this.musicplayerRange.nativeElement.value = this.musicplayer.nativeElement.currentTime

    this.htmlFullLengthAudio = this.joemama(Math.floor(this.musicplayer.nativeElement.duration))

    setInterval(() => {
      this.htmlElapseLengthAudio = this.joemama(Math.floor(this.musicplayer.nativeElement.currentTime))
    }, 500)
      
    setInterval(() => { 
      this.musicplayerRange.nativeElement.value = this.musicplayer.nativeElement.currentTime
      console.log("1s RANGE -> AUDIO (auto)")
    }, 1000)
  }

  musicplayerF(){
    let musicplayerDuration = Math.floor(this.musicplayer.nativeElement.duration)
    this.musicplayerDuration = Math.floor(this.musicplayer.nativeElement.duration)
    let increase = 0.1
    let time = 180
    
    this.musicplayer.nativeElement.currentTime = Math.floor(Math.random() * musicplayerDuration)
    this.musicplayer.nativeElement.volume = 0
    this.musicplayer.nativeElement.play()
    this.isPlaying = true
    this.mediaplayerPlayIcon = this.icons.faPause

    setTimeout(() => {
      this.musicplayer.nativeElement.volume += increase
      setTimeout(() => {
        this.musicplayer.nativeElement.volume += increase
        setTimeout(() => {
          this.musicplayer.nativeElement.volume += increase
        }, time)
      }, time)
    }, time)
  }

  musicplayerRangeF(){
    this.musicplayer.nativeElement.currentTime = this.musicplayerRange.nativeElement.value
    console.log("AUDIO -> RANGE")  
  }

  musicplayerPlay(){
    if (this.musicplayer.nativeElement.paused == true) {
      this.musicplayer.nativeElement.play()
      this.isPlaying = true
      this.mediaplayerPlayIcon = this.icons.faPause
    } else {
      this.musicplayer.nativeElement.pause()
      this.isPlaying = true
      this.mediaplayerPlayIcon = this.icons.faPlay
    }
  }

  getData(){
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        pos => {
        let userLat = pos.coords.latitude
        let userLon = pos.coords.longitude
        console.log(userLat, userLon)
        this.getWeatherDataGeo(userLat, userLon)
        this.userHasGeo = false
        },
        error => {if (error.code == 0 || 1 || 2 || 3) {this.userHasGeo = true}}
    )
    } else {alert("Ops! Seu navegador não tem suporte para este recurso. Use o serviço de busca.")}

    if (localStorage.getItem("volume") == undefined) {
      this.hasVolume = true
    }
  }

  getWeatherDataGeo(userLat: any, userLon: any){
    this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=c027ff71441a14766a6b79b9be8c447e&lang=pt`)
    .subscribe(
      (data: any) => {this.setWeatherDataGeo(data)}
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
    this.weatherData.desc = (this.weatherData.weather[0].description)

    this.checkCond(this.weatherData.weatherCond)
    this.checkIcon()
    
    if (this.weatherData.cityName == localStorage.getItem("bookmark")) {
      this.bookMarkIcon = this.icons.faCheck
      this.LocalContainsBookMark = true
    } else {
      this.bookMarkIcon = this.icons.faBookmark
      this.LocalContainsBookMark = false
    }
  }

  getWeatherDataLocation(cidade: any){
    this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=c027ff71441a14766a6b79b9be8c447e&lang=pt`)
    .subscribe({
      next: (data: any) => {this.setWeatherDataLocation(data)},
      error: (err: any) => {
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
    this.weatherData.desc = (this.weatherData.weather[0].description)

    this.checkCond(this.weatherData.weatherCond)
    this.checkIcon()

    if (localStorage.getItem("bookmark") == null) {
      this.bookMarkIcon = this.icons.faBookmark
    }
    
    if (this.weatherData.cityName == localStorage.getItem("bookmark")) {
      this.bookMarkIcon = this.icons.faCheck
      this.LocalContainsBookMark = true
    } else {
      this.bookMarkIcon = this.icons.faBookmark
      this.LocalContainsBookMark = false
    }

    console.log(this.weatherData)
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
        break
      case "Snow":
        this.snow = true
        break
      case "Smoke":
        this.smoke = true
        break
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
    this.snow = false
    this.smoke = false
    this.description = "Carregando.."
  }

  userGeoDenied(){
    this.userHasGeo = false
    this.getWeatherDataLocation("brasil")
  }

  checkBookmark(){
    if (localStorage.getItem("bookmark") != null){
      this.WebsiteContainsBookMark = true
    } else {
      this.WebsiteContainsBookMark = false
    }
  }

  bookCity(){
    if (this.LocalContainsBookMark == true) {
      localStorage.removeItem("bookmark")
      this.LocalContainsBookMark = false
      this.bookMarkIcon = this.icons.faBookmark
      console.log("primeira")
    } else {
      localStorage.setItem("bookmark", this.weatherData.cityName)
      this.LocalContainsBookMark = true
      this.bookMarkIcon = this.icons.faCheck
      console.log("segunda")
    }
  }

  hamburguerOpen(){
    if (this.hambugerOpened == true) {
      this.hambugerOpened = false
    } else {
      this.hambugerOpened = true
    }
  }

  goToBookCity(){
    console.log(this.LocalContainsBookMark)

    if (this.WebsiteContainsBookMark) {
      this.hambugerOpened = false
      this.getWeatherDataLocation(localStorage.getItem("bookmark"))
    } else {
      alert("Nenhuma cidade favoritada!")
    }
  }

  volumeF(){
    if (this.hasVolume == true) {
      this.hasVolume = false
      this.musicplayer.nativeElement.volume = 0
      this.iconVolume = this.icons.faVolumeMute

      if (localStorage.getItem("volume") == undefined || localStorage.getItem("volume") == null) {
        localStorage.setItem("volume", "volume")
      }

    } else {
      this.hasVolume = true
      this.musicplayer.nativeElement.volume = 0.3
      this.iconVolume = this.icons.faVolumeHigh
      if (localStorage.getItem("volume")) {
        localStorage.removeItem("volume")
      }
    }
  }
}