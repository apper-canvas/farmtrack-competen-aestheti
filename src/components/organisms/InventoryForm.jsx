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
ItemName_c: "",
    Category_c: "seeds",
    Description_c: "",
    Supplier_c: "",
    UnitCost_c: "",
    CurrentStock_c: "",
    MinimumStock_c: "",
    MaximumStock_c: "",
    Unit_c: "",
    StorageLocation_c: "",
    PurchaseDate_c: "",
    ExpiryDate_c: "",
    Notes_c: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        ItemName_c: item.ItemName_c || "",
        Category_c: item.Category_c || "seeds",
        Description_c: item.Description_c || "",
        Supplier_c: item.Supplier_c || "",
        UnitCost_c: item.UnitCost_c || "",
        CurrentStock_c: item.CurrentStock_c || "",
        MinimumStock_c: item.MinimumStock_c || "",
        MaximumStock_c: item.MaximumStock_c || "",
        Unit_c: item.Unit_c || "",
        StorageLocation_c: item.StorageLocation_c || "",
        PurchaseDate_c: item.PurchaseDate_c ? item.PurchaseDate_c.split("T")[0] : "",
        ExpiryDate_c: item.ExpiryDate_c ? item.ExpiryDate_c.split("T")[0] : "",
        Notes_c: item.Notes_c || ""
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemData = {
        ...formData,
        UnitCost_c: parseFloat(formData.UnitCost_c) || 0,
        CurrentStock_c: parseInt(formData.CurrentStock_c) || 0,
        MinimumStock_c: parseInt(formData.MinimumStock_c) || 0,
        MaximumStock_c: parseInt(formData.MaximumStock_c) || 0
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
            name="ItemName_c"
            value={formData.ItemName_c}
            onChange={handleChange}
            required
            placeholder="e.g., Hybrid Corn Seeds, NPK Fertilizer"
          />
          <Select
            label="Category"
            name="Category_c"
            value={formData.Category_c}
            onChange={handleChange}
            required
          >
            <option value="seeds">Seeds</option>
            <option value="fertilizers">Fertilizers</option>
            <option value="Equipments">Equipment</option>
            <option value="suplies">Supplies</option>
          </Select>
          <Input
            label="Supplier"
            name="Supplier_c"
            value={formData.Supplier_c}
            onChange={handleChange}
            placeholder="e.g., AgriSeeds Co."
          />
          <Input
            label="Unit Cost"
            name="UnitCost_c"
            type="number"
            step="0.01"
            min="0"
            value={formData.UnitCost_c}
            onChange={handleChange}
            placeholder="0.00"
          />
          <Input
            label="Current Stock"
            name="CurrentStock_c"
            type="number"
            min="0"
            value={formData.CurrentStock_c}
            onChange={handleChange}
            required
            placeholder="0"
          />
          <Input
            label="Minimum Stock"
            name="MinimumStock_c"
            type="number"
            min="0"
            value={formData.MinimumStock_c}
            onChange={handleChange}
            placeholder="0"
          />
          <Input
            label="Maximum Stock"
            name="MaximumStock_c"
            type="number"
            min="0"
            value={formData.MaximumStock_c}
            onChange={handleChange}
            placeholder="0"
          />
          <Input
            label="Unit"
            name="Unit_c"
            value={formData.Unit_c}
            onChange={handleChange}
            placeholder="e.g., bags, pieces, liters"
          />
          <Input
            label="Storage Location"
            name="StorageLocation_c"
            value={formData.StorageLocation_c}
            onChange={handleChange}
            placeholder="e.g., Seed Storage A, Equipment Shed"
          />
          <Input
            label="Purchase Date"
            name="PurchaseDate_c"
            type="date"
            value={formData.PurchaseDate_c}
            onChange={handleChange}
          />
          <Input
            label="Expiry Date"
            name="ExpiryDate_c"
            type="date"
            value={formData.ExpiryDate_c}
            onChange={handleChange}
          />
        </div>
        <Textarea
          label="Description"
          name="Description_c"
          value={formData.Description_c}
          onChange={handleChange}
          placeholder="Detailed description of the inventory item..."
          rows={3}
        />
        <Textarea
          label="Notes"
          name="Notes_c"
          value={formData.Notes_c}
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