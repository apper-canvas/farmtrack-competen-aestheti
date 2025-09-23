import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { irrigationService } from "@/services/api/irrigationService";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const IrrigationForm = ({ irrigation, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    irrigationType: "",
    waterSource: "",
    schedule: "",
    duration: "",
    waterUsed: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (irrigation) {
      setFormData({
        name: irrigation.name || "",
        irrigationType: irrigation.irrigationType || "",
        waterSource: irrigation.waterSource || "",
        schedule: irrigation.schedule || "",
        duration: irrigation.duration || "",
        waterUsed: irrigation.waterUsed || ""
      });
    }
  }, [irrigation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const irrigationData = {
        ...formData,
        duration: parseFloat(formData.duration) || 0,
        waterUsed: parseFloat(formData.waterUsed) || 0
      };

      if (irrigation) {
        await irrigationService.update(irrigation.Id, irrigationData);
        toast.success("Irrigation record updated successfully!");
      } else {
        await irrigationService.create(irrigationData);
        toast.success("Irrigation record created successfully!");
      }
      
      onSave();
    } catch (error) {
      toast.error(error.message || "Failed to save irrigation record");
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
          {irrigation ? "Edit Irrigation" : "Add New Irrigation"}
        </h2>
        <p className="text-gray-600">
          {irrigation ? "Update irrigation information" : "Enter details for your irrigation activity"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Field 1 Morning Watering, Crop Block A Irrigation"
          required
        />

        <Select
          label="Irrigation Type"
          name="irrigationType"
          value={formData.irrigationType}
          onChange={handleChange}
          placeholder="Select irrigation type"
          required
        >
          <option value="Drip">Drip</option>
          <option value="Flood">Flood</option>
          <option value="Sprinkler">Sprinkler</option>
          <option value="Micro-sprinkler">Micro-sprinkler</option>
          <option value="Surface">Surface</option>
        </Select>

        <Input
          label="Water Source"
          name="waterSource"
          value={formData.waterSource}
          onChange={handleChange}
          placeholder="e.g., Well, River, Municipal Water, Pond"
          required
        />

        <Input
          label="Schedule"
          name="schedule"
          value={formData.schedule}
          onChange={handleChange}
          placeholder="e.g., Daily 6:00 AM, Every 2 days, Monday/Wednesday/Friday"
          required
        />

        <Input
          label="Duration (minutes)"
          name="duration"
          type="number"
          step="1"
          value={formData.duration}
          onChange={handleChange}
          placeholder="e.g., 30, 60, 120"
          required
        />

        <Input
          label="Water Used (litres or m³)"
          name="waterUsed"
          type="number"
          step="0.1"
          value={formData.waterUsed}
          onChange={handleChange}
          placeholder="e.g., 500, 1200.5, 2.5"
          required
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
            {loading ? "Saving..." : irrigation ? "Update Irrigation" : "Add Irrigation"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default IrrigationForm;