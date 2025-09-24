import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { inventoryService } from "@/services/api/inventoryService";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const InventoryForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Seeds",
    description: "",
    supplier: "",
    unitCost: "",
    currentStock: "",
    minStock: "",
    maxStock: "",
    unit: "",
    location: "",
    purchaseDate: "",
    expiryDate: "",
    notes: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        itemName: item.itemName || "",
        category: item.category || "Seeds",
        description: item.description || "",
        supplier: item.supplier || "",
        unitCost: item.unitCost || "",
        currentStock: item.currentStock || "",
        minStock: item.minStock || "",
        maxStock: item.maxStock || "",
        unit: item.unit || "",
        location: item.location || "",
        purchaseDate: item.purchaseDate ? item.purchaseDate.split("T")[0] : "",
        expiryDate: item.expiryDate ? item.expiryDate.split("T")[0] : "",
        notes: item.notes || ""
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemData = {
        ...formData,
        unitCost: parseFloat(formData.unitCost) || 0,
        currentStock: parseInt(formData.currentStock) || 0,
        minStock: parseInt(formData.minStock) || 0,
        maxStock: parseInt(formData.maxStock) || 0
      };

      if (item) {
        await inventoryService.update(item.Id, itemData);
        toast.success("Inventory item updated successfully!");
      } else {
        await inventoryService.create(itemData);
        toast.success("Inventory item created successfully!");
      }
      
      onSave();
    } catch (error) {
      toast.error(error.message || "Failed to save inventory item");
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
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            placeholder="e.g., Hybrid Corn Seeds, NPK Fertilizer"
          />
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Seeds">Seeds</option>
            <option value="Fertilizers">Fertilizers</option>
            <option value="Equipment">Equipment</option>
            <option value="Supplies">Supplies</option>
          </Select>
          <Input
            label="Supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            placeholder="e.g., AgriSeeds Co."
          />
          <Input
            label="Unit Cost"
            name="unitCost"
            type="number"
            step="0.01"
            min="0"
            value={formData.unitCost}
            onChange={handleChange}
            placeholder="0.00"
          />
          <Input
            label="Current Stock"
            name="currentStock"
            type="number"
            min="0"
            value={formData.currentStock}
            onChange={handleChange}
            required
            placeholder="0"
          />
          <Input
            label="Minimum Stock"
            name="minStock"
            type="number"
            min="0"
            value={formData.minStock}
            onChange={handleChange}
            placeholder="0"
          />
          <Input
            label="Maximum Stock"
            name="maxStock"
            type="number"
            min="0"
            value={formData.maxStock}
            onChange={handleChange}
            placeholder="0"
          />
          <Input
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="e.g., bags, pieces, liters"
          />
          <Input
            label="Storage Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Seed Storage A, Equipment Shed"
          />
          <Input
            label="Purchase Date"
            name="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={handleChange}
          />
          <Input
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
          />
        </div>
        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of the inventory item..."
          rows={3}
        />
        <Textarea
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes or special instructions..."
          rows={3}
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
            {loading ? "Saving..." : item ? "Update Item" : "Add Item"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default InventoryForm;