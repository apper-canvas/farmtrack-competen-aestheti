import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const InventoryCard = ({ item, onEdit, onDelete }) => {
  const getStockStatus = () => {
if (item.CurrentStock_c <= item.MinimumStock_c) {
      return { status: "Low Stock", color: "warning", icon: "AlertTriangle" };
    } else if (item.CurrentStock_c >= item.MaximumStock_c) {
      return { status: "Overstocked", color: "info", icon: "TrendingUp" };
    } else {
      return { status: "Good Stock", color: "success", icon: "CheckCircle" };
    }
  };

  const stockInfo = getStockStatus();
  const stockPercentage = item.MaximumStock_c > 0 ? (item.CurrentStock_c / item.MaximumStock_c) * 100 : 0;

  const getCategoryIcon = (category) => {
    switch (category) {
      case "seeds":
        return "Sprout";
      case "fertilizers":
        return "Zap";
      case "Equipments":
        return "Wrench";
      case "suplies":
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
    if (!item.ExpiryDate_c) return false;
    const expiryDate = new Date(item.ExpiryDate_c);
    const today = new Date();
    const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30 && daysDiff > 0;
  };

  const isExpired = () => {
    if (!item.ExpiryDate_c) return false;
    return new Date(item.ExpiryDate_c) < new Date();
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <ApperIcon name={getCategoryIcon(item.Category_c)} className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 leading-tight">
              {item.ItemName_c}
            </h3>
            <p className="text-sm text-gray-500">{item.Category_c}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {item.Unit_c}
        </Badge>
      </div>

      {/* Description */}
      {item.Description_c && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {item.Description_c}
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
            <span>Current: {item.CurrentStock_c}</span>
            <span>Min: {item.MinimumStock_c}</span>
            <span>Max: {item.MaximumStock_c}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                stockPercentage <= (item.MinimumStock_c / item.MaximumStock_c) * 100 
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
        {item.Supplier_c && (
          <div className="flex items-center space-x-2">
            <ApperIcon name="Building2" className="h-4 w-4" />
            <span>{item.Supplier_c}</span>
          </div>
        )}
        {item.StorageLocation_c && (
          <div className="flex items-center space-x-2">
            <ApperIcon name="MapPin" className="h-4 w-4" />
            <span>{item.StorageLocation_c}</span>
          </div>
        )}
        {item.UnitCost_c && (
          <div className="flex items-center space-x-2">
            <ApperIcon name="DollarSign" className="h-4 w-4" />
            <span>${item.UnitCost_c.toFixed(2)} per {item.Unit_c}</span>
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
            {isExpired() ? 'Expired' : 'Expires Soon'}: {formatDate(item.ExpiryDate_c)}
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