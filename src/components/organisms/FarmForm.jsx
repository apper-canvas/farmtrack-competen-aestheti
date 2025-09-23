import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { farmService } from "@/services/api/farmService";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const FarmForm = ({ farm, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    name: "",
    location: "",
    sizeAcres: "",
    type: "",
    notes: "",
    soilType: "",
    gpsCoordinates: "",
    currentCrop: "",
    irrigationType: "",
    pastCropHistory: "",
    fertilityLevel: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (farm) {
setFormData({
        name: farm.name || "",
        location: farm.location || "",
        sizeAcres: farm.sizeAcres || "",
        type: farm.type || "",
        notes: farm.notes || "",
        soilType: farm.soilType || "",
        gpsCoordinates: farm.gpsCoordinates || "",
        currentCrop: farm.currentCrop || "",
        irrigationType: farm.irrigationType || "",
        pastCropHistory: farm.pastCropHistory || "",
        fertilityLevel: farm.fertilityLevel || ""
      });
    }
  }, [farm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

try {
      const farmData = {
        ...formData,
        sizeAcres: parseFloat(formData.sizeAcres) || 0
      };

      if (farm) {
        await farmService.update(farm.Id, farmData);
        toast.success("Farm updated successfully!");
      } else {
        await farmService.create(farmData);
        toast.success("Farm created successfully!");
      }
      
      onSave();
    } catch (error) {
      toast.error(error.message || "Failed to save farm");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {farm ? "Edit Farm" : "Add New Farm"}
        </h2>
        <p className="text-gray-600">
          {farm ? "Update farm information" : "Enter details for your new farm property"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Farm Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Sunset Farm, Green Valley Ranch"
          required
        />

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., County Road 123, Springfield"
          required
        />

        <Input
          label="Size (acres)"
          name="sizeAcres"
          type="number"
          step="0.1"
          value={formData.sizeAcres}
          onChange={handleChange}
          placeholder="e.g., 150.5"
required
        />

<Input
          label="Farm Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g., Crop Farm, Livestock, Mixed"
        />

        <Select
          label="Soil Type"
          name="soilType"
          value={formData.soilType}
          onChange={handleChange}
          placeholder="Select soil type"
        >
          <option value="Clay">Clay</option>
          <option value="Sandy">Sandy</option>
          <option value="Loam">Loam</option>
          <option value="Silty Clay">Silty Clay</option>
          <option value="Sandy Loam">Sandy Loam</option>
          <option value="Clay Loam">Clay Loam</option>
          <option value="Silt Loam">Silt Loam</option>
          <option value="Peat">Peat</option>
          <option value="Chalky">Chalky</option>
        </Select>

        <Input
          label="GPS Coordinates / Map View"
          name="gpsCoordinates"
          value={formData.gpsCoordinates}
          onChange={handleChange}
          placeholder="e.g., 40.7128, -74.0060 or map link"
        />

        <Input
          label="Current Crop"
          name="currentCrop"
          value={formData.currentCrop}
          onChange={handleChange}
          placeholder="e.g., Corn, Wheat, Soybeans"
        />

        <Select
          label="Irrigation Type"
          name="irrigationType"
          value={formData.irrigationType}
          onChange={handleChange}
          placeholder="Select irrigation type"
        >
          <option value="Drip Irrigation">Drip Irrigation</option>
          <option value="Sprinkler System">Sprinkler System</option>
          <option value="Surface Irrigation">Surface Irrigation</option>
          <option value="Subsurface Irrigation">Subsurface Irrigation</option>
          <option value="Center Pivot">Center Pivot</option>
          <option value="Rain Fed">Rain Fed</option>
          <option value="Flood Irrigation">Flood Irrigation</option>
          <option value="Furrow Irrigation">Furrow Irrigation</option>
        </Select>

        <Textarea
          label="Past Crop History"
          name="pastCropHistory"
          value={formData.pastCropHistory}
          onChange={handleChange}
          placeholder="Previous crops grown, rotation history, yield information..."
          rows={4}
        />

        <Select
          label="Fertility Level"
          name="fertilityLevel"
          value={formData.fertilityLevel}
          onChange={handleChange}
          placeholder="Select fertility level"
        >
          <option value="Very Low">Very Low</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
          <option value="Very High">Very High</option>
          <option value="Optimal">Optimal</option>
        </Select>
        <Textarea
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional information about the farm..."
          rows={4}
        />

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon="Save"
            disabled={loading}
          >
            {loading ? "Saving..." : farm ? "Update Farm" : "Add Farm"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FarmForm;