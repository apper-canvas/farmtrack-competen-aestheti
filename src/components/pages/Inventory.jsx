import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import InventoryCard from "@/components/molecules/InventoryCard";
import InventoryForm from "@/components/organisms/InventoryForm";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { inventoryService } from "@/services/api/inventoryService";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, categoryFilter, stockFilter]);

  const loadInventory = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (error) {
      setError(error.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = [...inventory];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Filter by stock level
    if (stockFilter === "low") {
      filtered = filtered.filter(item => item.currentStock <= item.minStock);
    } else if (stockFilter === "good") {
      filtered = filtered.filter(item => item.currentStock > item.minStock);
    }

    setFilteredInventory(filtered);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      try {
        await inventoryService.delete(itemId);
        toast.success("Inventory item deleted successfully!");
        loadInventory();
      } catch (error) {
        toast.error("Failed to delete inventory item");
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingItem(null);
    loadInventory();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const categories = [...new Set(inventory.map(item => item.category))];

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {editingItem ? "Edit Inventory Item" : "Add New Item"}
            </h1>
            <p className="text-gray-600 mt-2">
              {editingItem ? "Update inventory item information" : "Add a new item to your inventory"}
            </p>
          </div>
        </div>
        <InventoryForm
          item={editingItem}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadInventory} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-gray-600 mt-2">
            Track and manage all your farm inventory items
          </p>
        </div>
        <Button
          onClick={handleAddItem}
          icon="Plus"
          variant="primary"
          size="lg"
        >
          Add New Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search items by name, category, supplier, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="lg:w-48">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          </div>
          <div className="lg:w-48">
            <Select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock</option>
              <option value="good">Good Stock</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      {inventory.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-2xl font-bold text-blue-800">
              {inventory.filter(i => i.category === "Seeds").length}
            </div>
            <div className="text-sm text-blue-600 font-medium">Seeds</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-2xl font-bold text-green-800">
              {inventory.filter(i => i.category === "Fertilizers").length}
            </div>
            <div className="text-sm text-green-600 font-medium">Fertilizers</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-2xl font-bold text-purple-800">
              {inventory.filter(i => i.category === "Equipment").length}
            </div>
            <div className="text-sm text-purple-600 font-medium">Equipment</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="text-2xl font-bold text-orange-800">
              {inventory.filter(i => i.category === "Supplies").length}
            </div>
            <div className="text-sm text-orange-600 font-medium">Supplies</div>
          </Card>
        </div>
      )}

      {/* Inventory Grid */}
      {filteredInventory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item) => (
            <InventoryCard
              key={item.Id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      ) : inventory.length === 0 ? (
        <Empty
          title="No inventory items found"
          description="Start by adding your first inventory item to begin tracking your farm supplies"
          icon="Package"
          actionLabel="Add First Item"
          onAction={handleAddItem}
        />
      ) : (
        <Card className="text-center py-12">
          <ApperIcon name="Search" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items match your filters</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setStockFilter("all");
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Inventory;