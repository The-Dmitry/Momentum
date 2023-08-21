import './weather.scss';
import NewNodeParams from 'classes/util/interfaces/NewNodeParams';
import { ForecastData } from 'classes/util/interfaces/ForecastData';
import InputNodeCreator from '../../util/input-creator';
import NodeCreator from '../../util/node-creator';
import View from '../view';
import EventEmitter from '../emitter/event-emitter';

export default class Weather extends View {
  private emitter: EventEmitter;

  private forecastData: ForecastData | null = null;

  private weatherContainer: NodeCreator | null = null;

  private city: string;

  constructor() {
    const params: NewNodeParams = {
      tag: 'section',
      cssClasses: ['weather'],
      callback: () => {},
    };
    super(params);
    this.emitter = EventEmitter.getInstance();
    const cityFromLs = localStorage.getItem('city');
    if (cityFromLs) {
      this.city = cityFromLs;
    } else {
      this.city = 'Minsk';
    }
    this.configureView();
  }

  private async configureView() {
    const weatherContainer = new NodeCreator({
      tag: 'div',
      cssClasses: ['weather-container'],
    });
    const cityInput = new InputNodeCreator({
      tag: 'input',
      type: 'text',
      cssClasses: ['weather-input'],
    });
    cityInput.getNode().value = this.city;
    cityInput.setCallback((e) => {
      if (e instanceof KeyboardEvent && e.code === 'Enter') {
        this.city = cityInput.getNode().value.trim();

        this.updateForecast(this.city);
      }
    }, 'keydown');
    this.viewNode.addInnerNode(cityInput, weatherContainer);
    this.weatherContainer = weatherContainer;
    await this.updateForecast(this.city);
    this.generateForecastInfo();
  }

  private async updateForecast(city: string = 'Minsk') {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=en&appid=26e356d650c92ed8ad35e52cab77cc42&units=metric`;
    const response = await fetch(url);
    const data: ForecastData = await response.json();
    console.log(data);
    if (data.cod === 200) {
      this.forecastData = data;
      this.generateForecastInfo();
      localStorage.setItem('city', city);
      return;
    }
    this.forecastData = null;
    this.generateForecastInfo();
  }

  private generateForecastInfo() {
    const date = new Date().getHours();
    const partOfDay = date > 22 || date < 4 ? 'n' : 'd';
    this.weatherContainer?.removeAllChildren();
    if (this.forecastData?.cod === 200) {
      const weatherIcon = new NodeCreator({
        tag: 'div',
        cssClasses: ['weather-icon', 'owf', `owf-${this.forecastData.weather[0].id}-${partOfDay}`],
      });
      const weatherTemp = new NodeCreator({
        tag: 'div',
        cssClasses: ['weather__temp'],
        textContent: `${Math.round(this.forecastData.main.temp)}${String.fromCharCode(0xb0)}C`,
      });
      const weatherInfo = new NodeCreator({
        tag: 'ul',
        cssClasses: ['weather__info'],
      });
      const description = new NodeCreator({
        tag: 'li',
        cssClasses: ['weather__description'],
        textContent: `${this.forecastData.weather[0].description}`,
      });
      const humidity = new NodeCreator({
        tag: 'li',
        cssClasses: ['weather__humidity'],
        textContent: `Humidity: ${this.forecastData.main.humidity}%`,
      });
      const wind = new NodeCreator({
        tag: 'li',
        cssClasses: ['weather__wind'],
        textContent: `Wind speed: ${Math.round(this.forecastData.wind.speed)} m/s`,
      });
      weatherInfo.addInnerNode(description, humidity, wind);
      this.weatherContainer?.addInnerNode(weatherIcon, weatherTemp, weatherInfo);
      return;
    }
    const errorMessage = new NodeCreator({
      tag: 'div',
      cssClasses: ['weather-error'],
      textContent: 'City not found',
    });
    this.weatherContainer?.addInnerNode(errorMessage);
  }
}
