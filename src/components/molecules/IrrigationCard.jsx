import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const IrrigationCard = ({ irrigation, onEdit, onDelete }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-md">
            <ApperIcon name="Droplets" className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{irrigation.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="primary" size="sm">
                {irrigation.irrigationType}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <ApperIcon name="Waves" className="h-4 w-4" />
            <span>Water Source</span>
          </span>
          <span className="font-medium text-gray-900">{irrigation.waterSource || 'Not specified'}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <ApperIcon name="Clock" className="h-4 w-4" />
            <span>Schedule</span>
          </span>
          <span className="font-medium text-gray-900">{irrigation.schedule || 'Not specified'}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <ApperIcon name="Timer" className="h-4 w-4" />
            <span>Duration</span>
          </span>
          <span className="font-medium text-gray-900">{irrigation.duration} minutes</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <ApperIcon name="Gauge" className="h-4 w-4" />
            <span>Water Used</span>
          </span>
          <span className="font-medium text-gray-900">{irrigation.waterUsed} L</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(irrigation)}
          icon="Edit"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(irrigation.Id)}
          icon="Trash2"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default IrrigationCard;