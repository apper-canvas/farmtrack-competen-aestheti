import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FarmCard = ({ farm, onEdit, onDelete }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-md">
            <ApperIcon name="Home" className="h-6 w-6 text-primary-700" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{farm.name}</h3>
            {farm.location && (
              <p className="text-sm text-gray-600">{farm.location}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <ApperIcon name="MapPin" className="h-4 w-4" />
            <span>Location</span>
          </span>
          <span className="font-medium text-gray-900">{farm.location || 'Not specified'}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center space-x-1">
            <ApperIcon name="Square" className="h-4 w-4" />
            <span>Size</span>
          </span>
          <span className="font-medium text-gray-900">{farm.sizeAcres} acres</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(farm)}
          icon="Edit"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(farm.Id)}
          icon="Trash2"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default FarmCard;