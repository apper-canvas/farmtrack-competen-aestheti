import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";
import { taskService } from "@/services/api/taskService";
import { financialService } from "@/services/api/financialService";
import { weatherService } from "@/services/api/weatherService";
import { inventoryService } from "@/services/api/inventoryService";
import ApperIcon from "@/components/ApperIcon";
import TaskItem from "@/components/molecules/TaskItem";
import StatsCard from "@/components/molecules/StatsCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import Tasks from "@/components/pages/Tasks";
import Weather from "@/components/pages/Weather";
import Farms from "@/components/pages/Farms";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Dashboard = () => {
  const navigate = useNavigate();
const [data, setData] = useState({
    crops: [],
    farms: [],
    tasks: [],
    financials: [],
    weather: [],
    inventory: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

try {
const [crops, farms, tasks, financials, weather, inventory] = await Promise.all([
        cropService.getAll(),
        farmService.getAll(),
        taskService.getAll(),
        financialService.getAll(),
        weatherService.getForecast(),
        inventoryService.getAll()
      ]);

setData({ crops, tasks, financials, weather, farms, inventory });
    } catch (error) {
      setError(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const task = data.tasks.find(t => t.Id === taskId);
      if (task) {
        await taskService.update(taskId, { ...task, completed: !task.completed });
        toast.success(task.completed ? "Task marked incomplete" : "Task completed!");
        loadDashboardData();
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  if (loading) return <Loading variant="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

// Calculate statistics
  const activeCrops = data.crops.filter(crop => crop.status !== "harvested").length;
  const pendingTasks = data.tasks.filter(task => !task.completed).length;
  const overdueTasks = data.tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  ).length;
  
  const totalIncome = data.financials
    .filter(f => f.type === "income")
    .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
  
  const totalExpenses = data.financials
    .filter(f => f.type === "expense")
    .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);

  const netIncome = totalIncome - totalExpenses;

  // Inventory statistics
  const totalInventoryItems = data.inventory.length;
  const lowStockItems = data.inventory.filter(item => item.currentStock <= item.minStock).length;
  const inventoryValue = data.inventory.reduce((sum, item) => sum + (item.unitCost * item.currentStock), 0);
  // Get upcoming tasks
  const upcomingTasks = data.tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Get today's weather
  const todayWeather = data.weather[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Farm Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening on your farm today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => navigate("/tasks")}
            icon="Plus"
            variant="accent"
          >
            Add Task
          </Button>
          <Button
            onClick={() => navigate("/crops")}
            icon="Sprout"
            variant="primary"
          >
            Add Crop
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatsCard
          title="Total Farms"
          value={data.farms.length}
          icon="Home"
          color="primary"
          trend={data.farms.length > 0 ? "up" : ""}
          trendValue={`${data.farms.reduce((total, farm) => total + (farm.sizeAcres || 0), 0).toFixed(1)} acres`}
        />
        <StatsCard
          title="Active Crops"
          value={activeCrops}
          icon="Sprout"
          color="success"
          trend={activeCrops > 0 ? "up" : ""}
          trendValue={`${activeCrops} growing`}
        />
        <StatsCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="CheckSquare"
          color="warning"
          trend={overdueTasks > 0 ? "down" : ""}
          trendValue={overdueTasks > 0 ? `${overdueTasks} overdue` : "On track"}
        />
        <StatsCard
          title="Inventory Items"
          value={totalInventoryItems}
          icon="Package"
          color="info"
          trend={lowStockItems > 0 ? "down" : "up"}
          trendValue={lowStockItems > 0 ? `${lowStockItems} low stock` : "Well stocked"}
        />
        <StatsCard
          title="Net Income"
          value={`$${netIncome.toLocaleString()}`}
          icon="DollarSign"
          color={netIncome >= 0 ? "success" : "warning"}
          trend={netIncome >= 0 ? "up" : "down"}
          trendValue={netIncome >= 0 ? "Profit" : "Loss"}
        />
        <StatsCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon="TrendingDown"
          color="info"
          trendValue="This period"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weather Today */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Today's Weather</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/weather")}
                icon="ExternalLink"
              >
                View Forecast
              </Button>
            </div>
            {todayWeather ? (
              <WeatherCard weather={todayWeather} isToday={true} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Cloud" className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Weather data unavailable</p>
              </div>
            )}
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/tasks")}
                icon="ExternalLink"
              >
                View All Tasks
              </Button>
            </div>
            
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <TaskItem
                    key={task.Id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onEdit={(task) => navigate("/tasks", { state: { editTask: task } })}
                    onDelete={() => {}}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="CheckSquare" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending tasks</h3>
                  <p className="text-gray-600 mb-4">All caught up! Create a new task to get started.</p>
                  <Button
                    onClick={() => navigate("/tasks")}
                    icon="Plus"
                    variant="primary"
                  >
                    Add First Task
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Button
            onClick={() => navigate("/crops")}
            variant="outline"
            className="h-20 flex-col space-y-2"
            icon="Sprout"
          >
            <span>Add Crop</span>
          </Button>
          <Button
            onClick={() => navigate("/farms")}
            variant="outline"
            className="h-20 flex-col space-y-2"
            icon="Home"
          >
            <span>Manage Farms</span>
          </Button>
          <Button
            onClick={() => navigate("/tasks")}
            variant="outline"
            className="h-20 flex-col space-y-2"
            icon="CheckSquare"
          >
            <span>Create Task</span>
          </Button>
          <Button
            onClick={() => navigate("/inventory")}
            variant="outline"
            className="h-20 flex-col space-y-2"
            icon="Package"
          >
            <span>Manage Inventory</span>
          </Button>
          <Button
            onClick={() => navigate("/finances")}
            variant="outline"
            className="h-20 flex-col space-y-2"
            icon="DollarSign"
          >
            <span>Log Expense</span>
          </Button>
          <Button
            onClick={() => navigate("/weather")}
            variant="outline"
            className="h-20 flex-col space-y-2"
            icon="Cloud"
          >
            <span>Check Weather</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;