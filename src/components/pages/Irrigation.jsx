import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import IrrigationCard from "@/components/molecules/IrrigationCard";
import IrrigationForm from "@/components/organisms/IrrigationForm";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { irrigationService } from "@/services/api/irrigationService";

const Irrigation = () => {
  const [irrigations, setIrrigations] = useState([]);
  const [filteredIrrigations, setFilteredIrrigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingIrrigation, setEditingIrrigation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadIrrigations();
  }, []);

  useEffect(() => {
    filterIrrigations();
  }, [irrigations, searchTerm]);

  const loadIrrigations = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await irrigationService.getAll();
      setIrrigations(data);
    } catch (error) {
      setError(error.message || "Failed to load irrigation records");
    } finally {
      setLoading(false);
    }
  };

  const filterIrrigations = () => {
    let filtered = [...irrigations];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(irrigation =>
        irrigation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        irrigation.irrigationType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        irrigation.waterSource?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredIrrigations(filtered);
  };

  const handleAddIrrigation = () => {
    setEditingIrrigation(null);
    setShowForm(true);
  };

  const handleEditIrrigation = (irrigation) => {
    setEditingIrrigation(irrigation);
    setShowForm(true);
  };

  const handleDeleteIrrigation = async (irrigationId) => {
    if (window.confirm("Are you sure you want to delete this irrigation record?")) {
      try {
        await irrigationService.delete(irrigationId);
        toast.success("Irrigation record deleted successfully!");
        loadIrrigations();
      } catch (error) {
        toast.error("Failed to delete irrigation record");
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingIrrigation(null);
    loadIrrigations();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingIrrigation(null);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {editingIrrigation ? "Edit Irrigation" : "Add New Irrigation"}
            </h1>
            <p className="text-gray-600 mt-2">
              {editingIrrigation ? "Update irrigation information" : "Add a new irrigation activity"}
            </p>
          </div>
        </div>
        <IrrigationForm
          irrigation={editingIrrigation}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadIrrigations} />;

  const totalWaterUsed = irrigations.reduce((total, irrigation) => total + (irrigation.waterUsed || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Irrigation & Water Management
          </h1>
          <p className="text-gray-600 mt-2">
            Track and manage all your irrigation activities and water usage
          </p>
        </div>
        <Button
          onClick={handleAddIrrigation}
          icon="Plus"
          variant="primary"
          size="lg"
        >
          Add New Irrigation
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search irrigation by name, type, or water source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      {irrigations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-3xl font-bold text-blue-800">
              {irrigations.length}
            </div>
            <div className="text-sm text-blue-600 font-medium">Total Irrigation Records</div>
          </Card>
          <Card className="text-center bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
            <div className="text-3xl font-bold text-cyan-800">
              {totalWaterUsed.toFixed(1)}L
            </div>
            <div className="text-sm text-cyan-600 font-medium">Total Water Used</div>
          </Card>
        </div>
      )}

      {/* Irrigations Grid */}
      {filteredIrrigations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIrrigations.map((irrigation) => (
            <IrrigationCard
              key={irrigation.Id}
              irrigation={irrigation}
              onEdit={handleEditIrrigation}
              onDelete={handleDeleteIrrigation}
            />
          ))}
        </div>
      ) : irrigations.length === 0 ? (
        <Empty
          title="No irrigation records found"
          description="Start by adding your first irrigation activity to track water management"
          icon="Droplets"
          actionLabel="Add First Irrigation"
          onAction={handleAddIrrigation}
        />
      ) : (
        <Card className="text-center py-12">
          <ApperIcon name="Search" className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No irrigation records match your search</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <Button
            onClick={() => setSearchTerm("")}
            variant="outline"
          >
            Clear Search
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Irrigation;