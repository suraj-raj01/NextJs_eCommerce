'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "../../../../components/ui/dialog";
import Swal from 'sweetalert2'
import {
  AlertDialog,
  AlertDialogAction,  
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";
import { Switch } from "../../../../components/ui/switch";
import { Trash2, Edit, Plus, Calendar, Eye, EyeOff } from "lucide-react";
import axios from 'axios';

interface Plantype {
  id: string;
  type: number | null;
  typecheck: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  type: string;
  typecheck: boolean;
}

const PlanType = () => {
  const [formData, setFormData] = useState<FormData>({ type: '', typecheck: true });
  const [plantypes, setPlantypes] = useState<Plantype[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<Plantype | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [errors, setErrors] = useState<{ type?: string }>({});

  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${api}/store/plantype`);
      setPlantypes(response.data);
    } catch (error) {
      console.error('Failed to fetch plantypes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validateForm = (data: FormData): { type?: string } => {
    const newErrors: { type?: string } = {};
    
    if (!data.type || data.type.trim() === '') {
      newErrors.type = 'Number of days is required';
    } else if (parseInt(data.type) <= 0) {
      newErrors.type = 'Number of days must be greater than 0';
    } else if (parseInt(data.type) > 365) {
      newErrors.type = 'Number of days cannot exceed 365';
    }
    
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, typecheck: checked }));
  };

  const resetForm = () => {
    setFormData({ type: '', typecheck: true });
    setErrors({});
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type: parseInt(formData.type),
        typecheck: formData.typecheck,
      };

      if (editingItem) {
        console.log(editingItem.id,"id")
        await axios.patch(`${api}/store/plantype/${editingItem?.id}`, formData);
        Swal.fire({
          title: "Plantype Updated Successfully",
          icon: "success",
          draggable: true
        });
      } else {
        await axios.post(`${api}/store/plantype`, payload);
      }

      resetForm();
      setIsEditDialogOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Failed to save plantype:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (plan: Plantype) => {
    setEditingItem(plan);
    setFormData({
      type: plan.type?.toString() || '',
      typecheck: plan.typecheck,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${api}/store/plantype/${id}`);
      Swal.fire({
          title: "Plantype Deleted Successfully",
          icon: "success",
          draggable: true
        });
      await fetchData();
    } catch (error) {
      console.error('Failed to delete plantype:', error);
    }
  };

  const handleDialogClose = () => {
    setIsEditDialogOpen(false);
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen p-3">
      <div className="max-w-full mx-auto">
        {/* Breadcrumb */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/vendor" className="">
                    Vendor Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/vendor/sitesettings" className="">
                    Site Settings
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">
                    Plan Types
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </CardContent>
          <div className="flex items-center justify-between p-3">
          <div>
            <h1 className="text-3xl font-bold">Plan Types</h1>
            <p className=" mt-1 text-gray-400">Manage your subscription plan types and durations</p>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsEditDialogOpen(true)} className="">
                <Plus className="w-4 h-4 mr-2" />
                Add Plan Type
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {editingItem ? 'Edit Plan Type' : 'Create New Plan Type'}
                </DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Update the plan type details below.' : 'Add a new plan type to your system.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    Number of Days *
                  </Label>
                  <Input
                    id="type"
                    type="number"
                    name="type"
                    placeholder="e.g., 30, 90, 365"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`${errors.type ? 'border-red-500 focus:border-red-500' : ''}`}
                    min="1"
                    max="365"
                  />
                  {errors.type && (
                    <p className="text-sm text-red-500 mt-1">{errors.type}</p>
                  )}
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="typecheck" className="text-sm font-medium">
                      Enable Plan Type
                    </Label>
                    <p className="text-xs text-gray-500">
                      Toggle to enable or disable this plan type
                    </p>
                  </div>
                  <Switch
                    id="typecheck"
                    checked={formData.typecheck}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>

                <DialogFooter className="flex gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting} className="">
                    {isSubmitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        </Card>

        <br />
        {/* Main Content */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md font-semibold">
                Existing Plan Types
              </CardTitle>
              <Badge variant="secondary" className="">
                {plantypes.length} {plantypes.length === 1 ? 'Type' : 'Types'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 "></div>
                <span className="ml-2 ">Loading plan types...</span>
              </div>
            ) : plantypes.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No plan types found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first plan type.</p>
                <Button onClick={() => setIsEditDialogOpen(true)} className="">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Plan Type
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {plantypes.map((plan, index) => (
                  <div key={plan.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 " />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold">
                              {plan.type ?? 'N/A'} {plan.type === 1 ? 'Day' : 'Days'}
                            </p>
                            <Badge variant={plan.typecheck ? 'default' : 'secondary'} className="text-xs bg-blue-500 text-white dark:bg-blue-600">
                              {plan.typecheck ? (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </Badge>
                          </div>
                          {/* <p className="text-sm text-gray-500 mt-1">
                            Created {formatDate(plan.createdAt)}
                          </p> */}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(plan)}
                          className=" border-blue-200 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          {/* Edit */}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="">
                              <Trash2 className="w-4 h-4 mr-1" />
                              {/* Delete */}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the plan type
                                "{plan.type} {plan.type === 1 ? 'Day' : 'Days'}" from your system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(plan.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanType;