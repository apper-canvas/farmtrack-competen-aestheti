import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const InventoryCard = ({ item, onEdit, onDelete }) => {
  const getStockStatus = () => {
    if (item.currentStock <= item.minStock) {
      return { status: "Low Stock", color: "warning", icon: "AlertTriangle" };
    } else if (item.currentStock >= item.maxStock) {
      return { status: "Overstocked", color: "info", icon: "TrendingUp" };
    } else {
      return { status: "Good Stock", color: "success", icon: "CheckCircle" };
    }
  };

  const stockInfo = getStockStatus();
  const stockPercentage = item.maxStock > 0 ? (item.currentStock / item.maxStock) * 100 : 0;

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Seeds":
        return "Sprout";
      case "Fertilizers":
        return "Zap";
      case "Equipment":
        return "Wrench";
      case "Supplies":
        return "Package";
      default:
        return "Package";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const isExpiringSoon = () => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30 && daysDiff > 0;
  };

  const isExpired = () => {
    if (!item.expiryDate) return false;
    return new Date(item.expiryDate) < new Date();
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <ApperIcon name={getCategoryIcon(item.category)} className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 leading-tight">
              {item.itemName}
            </h3>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {item.unit}
        </Badge>
      </div>

      {/* Description */}
      {item.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {item.description}
        </p>
      )}

      {/* Stock Information */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Stock Level</span>
          <div className="flex items-center space-x-2">
            <ApperIcon name={stockInfo.icon} className={`h-4 w-4 text-${stockInfo.color}`} />
            <Badge variant={stockInfo.color} size="sm">
              {stockInfo.status}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current: {item.currentStock}</span>
            <span>Min: {item.minStock}</span>
            <span>Max: {item.maxStock}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                stockPercentage <= (item.minStock / item.maxStock) * 100 
                  ? 'bg-warning' 
                  : stockPercentage >= 100 
                    ? 'bg-info' 
                    : 'bg-success'
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
        {item.supplier && (
          <div className="flex items-center space-x-2">
            <ApperIcon name="Building2" className="h-4 w-4" />
            <span>{item.supplier}</span>
          </div>
        )}
        {item.location && (
          <div className="flex items-center space-x-2">
            <ApperIcon name="MapPin" className="h-4 w-4" />
            <span>{item.location}</span>
          </div>
        )}
        {item.unitCost && (
          <div className="flex items-center space-x-2">
            <ApperIcon name="DollarSign" className="h-4 w-4" />
            <span>${item.unitCost.toFixed(2)} per {item.unit}</span>
          </div>
        )}
      </div>

      {/* Expiry Warning */}
      {(isExpiringSoon() || isExpired()) && (
        <div className={`mb-4 p-2 rounded-md flex items-center space-x-2 text-sm ${
          isExpired() ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
        }`}>
          <ApperIcon name="AlertCircle" className="h-4 w-4" />
          <span>
            {isExpired() ? 'Expired' : 'Expires Soon'}: {formatDate(item.expiryDate)}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2 pt-4 border-t border-gray-100">
        <Button
          onClick={() => onEdit(item)}
          variant="outline"
          size="sm"
          className="flex-1"
          icon="Edit"
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete(item.Id)}
          variant="outline"
          size="sm"
          className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
          icon="Trash2"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default InventoryCard;