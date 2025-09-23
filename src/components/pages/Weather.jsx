import React, { useEffect, useState } from "react";
import { weatherService } from "@/services/api/weatherService";
import ApperIcon from "@/components/ApperIcon";
import WeatherCard from "@/components/molecules/WeatherCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Card from "@/components/atoms/Card";

const Weather = () => {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await weatherService.getForecast();
      setWeather(data);
    } catch (error) {
      setError(error.message || "Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadWeather} />;

  const todayWeather = weather[0];
  const forecastWeather = weather.slice(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Weather Forecast
          </h1>
          <p className="text-gray-600 mt-2">
            Plan your farm activities with accurate weather information
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="RefreshCw" className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Today's Weather - Featured */}
      {todayWeather && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Today's Weather</h2>
            <div className="text-sm text-gray-600 font-medium">
              {new Date(todayWeather.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <WeatherCard weather={todayWeather} isToday={true} />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Detailed Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Thermometer" className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium text-gray-600">Temperature</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {todayWeather.temperature.high}° / {todayWeather.temperature.low}°
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Droplets" className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Humidity</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {todayWeather.humidity}%
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="CloudRain" className="h-5 w-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Precipitation</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {todayWeather.precipitation}%
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon name="Eye" className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium text-gray-600">Conditions</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 capitalize">
                    {todayWeather.condition}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 5-Day Forecast */}
      {forecastWeather.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">5-Day Forecast</h2>
            <ApperIcon name="Calendar" className="h-6 w-6 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {forecastWeather.map((dayWeather, index) => (
              <WeatherCard key={index} weather={dayWeather} />
            ))}
          </div>
        </Card>
      )}

      {/* Agricultural Insights */}
<Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <ApperIcon name="Lightbulb" className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Agricultural Insights</h2>
        </div>
        
        <AIInsightsSection todayWeather={todayWeather} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Weather Recommendations</h3>
            <div className="space-y-3">
              {todayWeather?.condition === "sunny" && (
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <ApperIcon name="Sun" className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Perfect for Fieldwork</div>
                    <div className="text-sm text-gray-600">Ideal conditions for planting, harvesting, and equipment operation</div>
                  </div>
                </div>
              )}
              
              {todayWeather?.condition === "rainy" && (
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <ApperIcon name="CloudRain" className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Natural Irrigation</div>
                    <div className="text-sm text-gray-600">Good for plant growth, avoid heavy machinery use</div>
                  </div>
                </div>
              )}
              
              {todayWeather?.precipitation > 70 && (
                <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <ApperIcon name="Umbrella" className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">High Rain Chance</div>
                    <div className="text-sm text-gray-600">Consider postponing outdoor activities</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-800">Planning Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <ApperIcon name="Calendar" className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Check forecast regularly</div>
                  <div className="text-sm text-gray-600">Plan farm activities 3-5 days ahead</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <ApperIcon name="Sprout" className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Optimize planting times</div>
                  <div className="text-sm text-gray-600">Use weather patterns to maximize crop success</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                <ApperIcon name="Shield" className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Protect your crops</div>
                  <div className="text-sm text-gray-600">Prepare for extreme weather conditions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// AI Insights Component
const AIInsightsSection = ({ todayWeather }) => {
  const [aiInsights, setAiInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  useEffect(() => {
    if (todayWeather) {
      loadAIInsights();
    }
  }, [todayWeather]);

  const loadAIInsights = async () => {
    setInsightsLoading(true);
    setInsightsError("");

    try {
      const insights = await weatherService.getAIInsights(todayWeather);
      setAiInsights(insights);
    } catch (error) {
      setInsightsError("Failed to load AI insights");
      console.error("Error loading AI insights:", error);
    } finally {
      setInsightsLoading(false);
    }
  };

  if (!todayWeather) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-800 flex items-center space-x-2">
          <ApperIcon name="Bot" className="h-5 w-5 text-green-600" />
          <span>AI-Powered Insights</span>
        </h3>
        {insightsLoading && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Generating insights...</span>
          </div>
        )}
      </div>

      {insightsError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="AlertTriangle" className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">AI insights temporarily unavailable</span>
          </div>
        </div>
      )}

      {aiInsights.length > 0 && (
        <div className="space-y-3">
          {aiInsights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-green-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <ApperIcon name="Sparkles" className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{insight.title}</div>
                <div className="text-sm text-gray-700 mt-1">{insight.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!insightsLoading && aiInsights.length === 0 && !insightsError && (
        <div className="text-center py-4 text-gray-500">
          <ApperIcon name="Zap" className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">AI insights will appear here when available</p>
        </div>
      )}
    </div>
  );
};

export default Weather;