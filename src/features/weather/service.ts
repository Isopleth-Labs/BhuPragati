export type WeatherData = {
  temperatureC: number;
  condition: string;
  humidity: number;
  windKph: number;
  sunrise?: string; // ISO string or hh:mm
  sunset?: string;  // ISO string or hh:mm
};

const MOCK_WEATHER: Record<string, WeatherData> = {
  bihar: { temperatureC: 32, condition: "Hot", humidity: 58, windKph: 11, sunrise: "05:05", sunset: "18:40" },
  darbhanga: { temperatureC: 30, condition: "Humid", humidity: 64, windKph: 9, sunrise: "05:08", sunset: "18:37" },
  "kusheshwar-asthan": { temperatureC: 29, condition: "Humid", humidity: 66, windKph: 10, sunrise: "05:08", sunset: "18:36" },
  biraul: { temperatureC: 28, condition: "Cloudy", humidity: 70, windKph: 12, sunrise: "05:09", sunset: "18:35" },
};

const DEFAULT_WEATHER: WeatherData = {
  temperatureC: 27,
  condition: "Clear",
  humidity: 55,
  windKph: 8,
  sunrise: "05:10",
  sunset: "18:40",
};

export async function fetchWeather(regionId: string | null): Promise<WeatherData> {
  if (!regionId) return DEFAULT_WEATHER;
  const data = MOCK_WEATHER[regionId];
  return data ?? DEFAULT_WEATHER;
}
