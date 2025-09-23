import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const CropForm = ({ crop, onSave, onCancel }) => {
const [formData, setFormData] = useState({
    name: "",
    variety: "",
    plantingDate: "",
    expectedHarvest: "",
    fieldLocation: "",
    quantity: "",
    status: "planted",
    notes: "",
    farmId: ""
  });
  const [farms, setFarms] = useState([]);
  const [loadingFarms, setLoadingFarms] = useState(true);

  const [loading, setLoading] = useState(false);

useEffect(() => {
    const loadFarms = async () => {
      try {
        const farmData = await farmService.getAll();
        setFarms(farmData);
      } catch (error) {
        console.error("Error loading farms:", error);
        toast.error("Failed to load farms");
      } finally {
        setLoadingFarms(false);
      }
    };
    loadFarms();
  }, []);

  useEffect(() => {
    if (crop) {
      setFormData({
        name: crop.name || "",
        variety: crop.variety || "",
        plantingDate: crop.plantingDate ? crop.plantingDate.split("T")[0] : "",
        expectedHarvest: crop.expectedHarvest ? crop.expectedHarvest.split("T")[0] : "",
        fieldLocation: crop.fieldLocation || "",
        quantity: crop.quantity || "",
        status: crop.status || "planted",
        notes: crop.notes || "",
        farmId: crop.farmId || ""
      });
    }
  }, [crop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
const cropData = {
        ...formData,
        quantity: parseFloat(formData.quantity) || 0,
        farmId: formData.farmId ? parseInt(formData.farmId) : null
      };

      if (crop) {
        await cropService.update(crop.Id, cropData);
        toast.success("Crop updated successfully!");
      } else {
        await cropService.create(cropData);
        toast.success("Crop created successfully!");
      }
      
      onSave();
    } catch (error) {
      toast.error(error.message || "Failed to save crop");
    } finally {
      setLoading(false);
    }
  };

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Crop Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Tomatoes, Corn, Wheat"
          />
          <Input
            label="Variety"
            name="variety"
            value={formData.variety}
            onChange={handleChange}
            placeholder="e.g., Cherry, Sweet Corn"
          />
          <Input
            label="Planting Date"
            name="plantingDate"
            type="date"
            value={formData.plantingDate}
            onChange={handleChange}
            required
          />
          <Input
            label="Expected Harvest"
            name="expectedHarvest"
            type="date"
            value={formData.expectedHarvest}
            onChange={handleChange}
          />
          <Input
            label="Field Location"
            name="fieldLocation"
            value={formData.fieldLocation}
            onChange={handleChange}
            placeholder="e.g., North Field, Section A"
          />
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            step="0.01"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0.00"
          />
          <Select
            label="Farm"
            name="farmId"
            value={formData.farmId}
            onChange={handleChange}
            required
            disabled={loadingFarms}
          >
            <option value="">
              {loadingFarms ? "Loading farms..." : "Select a farm"}
            </option>
            {farms.map((farm) => (
              <option key={farm.Id} value={farm.Id}>
                {farm.name}
              </option>
            ))}
          </Select>
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="planted">Planted</option>
            <option value="growing">Growing</option>
            <option value="ready">Ready</option>
            <option value="harvested">Harvested</option>
          </Select>
        </div>
        <Textarea
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this crop..."
          rows={4}
        />
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
          >
            {loading ? "Saving..." : crop ? "Update Crop" : "Add Crop"}
          </Button>
        </div>
      </form>
</Card>
  );
};

export default CropForm;