import { Component } from '@angular/core';
import * as fontawesome from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  faCloudMoon = fontawesome.faCloudMoon
  faCloudMoonRain = fontawesome.faCloudMoonRain
  faCloud = fontawesome.faCloud
  faArrowUp = fontawesome.faArrowUp
  faArrowDown = fontawesome.faArrowDown
}