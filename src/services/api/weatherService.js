class WeatherService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'weather_c';
  }

  async getForecast() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}},
          {"field": {"Name": "temperature_high_c"}},
          {"field": {"Name": "temperature_low_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 10, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch weather forecast:", response.message);
        throw new Error(response.message);
      }

      // Transform database fields to component-expected format
      return response.data?.map(weather => ({
        date: weather.date_c || null,
        temperature: {
          high: weather.temperature_high_c || 0,
          low: weather.temperature_low_c || 0
        },
        condition: weather.condition_c || 'sunny',
        humidity: weather.humidity_c || 0,
        precipitation: weather.precipitation_c || 0
      })) || [];
    } catch (error) {
      console.error("Error in weatherService.getForecast:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getCurrentWeather() {
    try {
      const forecast = await this.getForecast();
      return forecast[0] || null;
    } catch (error) {
      console.error("Error in weatherService.getCurrentWeather:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getWeatherByDate(date) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "temperature_c"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}},
          {"field": {"Name": "temperature_high_c"}},
          {"field": {"Name": "temperature_low_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "EqualTo", "Values": [date]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(`Failed to fetch weather for ${date}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        throw new Error("Weather data not found for this date");
      }

      // Transform database fields to component-expected format
      const weather = response.data[0];
      return {
        date: weather.date_c || null,
        temperature: {
          high: weather.temperature_high_c || 0,
          low: weather.temperature_low_c || 0
        },
        condition: weather.condition_c || 'sunny',
        humidity: weather.humidity_c || 0,
        precipitation: weather.precipitation_c || 0
      };
    } catch (error) {
      console.error(`Error in weatherService.getWeatherByDate(${date}):`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();