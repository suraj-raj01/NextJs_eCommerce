'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Button } from '../../../../../../components/ui/button';
import { Input } from '../../../../../../components/ui/input';
import { Label } from '../../../../../../components/ui/label';
import { Textarea } from '../../../../../../components/ui/textarea';
import { Switch } from '../../../../../../components/ui/switch';
import { Badge } from '../../../../../../components/ui/badge';
import Swal from "sweetalert2"
import { Plus, X, Save, } from 'lucide-react';
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../../../components/ui/breadcrumb"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../../components/ui/select'
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

type Plan = {
  id: string;
  logo: string | null;
  checklogo: boolean;
  title: string;
  checktitle: boolean;
  subtitle: string;
  checksubtitle: boolean;
  price: number;
  checkprice: boolean;
  plantype: number;
  bilingcycle: string;
  checkduration: boolean;
  description: string;
  checkdescription: boolean;
  features: string[];
  checkfeatures: boolean;
  visibility: boolean;
  button: string;
  checkbutton: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

interface Plantype {
  id: string;
  type: number | null;
  typecheck: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BilingCycle {
  id: string;
  type: number | null;
  typecheck: boolean;
  createdAt: string;
  updatedAt: string;
}


const defaultPlan: Plan = {
  id: '',
  logo: '',
  checklogo: true,
  title: '',
  checktitle: true,
  subtitle: '',
  checksubtitle: true,
  price: 0,
  checkprice: true,
  plantype: 0,
  bilingcycle: '',
  checkduration: true,
  description: '',
  checkdescription: true,
  features: [],
  checkfeatures: true,
  visibility: true,
  button: '',
  checkbutton: true,
};


const PlansManager = () => {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [newFeature, setNewFeature] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [planType, setPlantypes] = useState<Plantype[]>([])
  const [formData, setFormData] = useState<Plan>(defaultPlan);
  const [bilingcycle, setBilingcycle] = useState<BilingCycle[]>([]);
  const [selectedPlanType, setSelectedPlanType] = useState<number | null>(null);
  const [selectedBilingCycle, setSelectedBilingCycle] = useState<string | null>(null);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  const params = useParams();
  const id = params.id as string
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await axios.post(`${api}/store/plans/${id}`);
      setFormData(response.data.data[0])
      console.log(response.data.data,"plansdataa")
    } catch (error) {
      console.error('Failed to fetch plantypes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  const fetchPlantype = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${api}/store/plantype`);
      setPlantypes(response.data);
      console.log(response.data, "plan data")
    } catch (error) {
      console.error('Failed to fetch plantypes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBilingcycle = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${api}/store/bilingcycle`);
      setBilingcycle(response?.data?.data);
      console.log(response.data.data, "billing cycle data")
    } catch (error) {
      console.error('Failed to fetch billing cycles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantype();
    fetchBilingcycle();
  }, []);


  const handleInputChange = (field: any, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    console.log(formData)
  };

  const handleSwitchChange = (field: any, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
  setFormData(prev => {
    const newFeatures = [...prev.features]; // copy
    newFeatures.splice(index, 1); // remove 1 item at index
    return { ...prev, features: newFeatures };
  });
};

  const validateForm = () => {
    const errors: string[] = [];

    if (formData.checktitle && !formData.title.trim()) {
      errors.push('Title is required');
    }

    if (formData.checkprice && formData.price < 0) {
      errors.push('Price must be a positive number');
    }

    if (formData.checkbutton && !formData.button.trim()) {
      errors.push('Button text is required');
    }

    if (formData.checkduration && !selectedBilingCycle) {
      errors.push('Billing cycle is required');
    }

    if (!selectedPlanType) {
      errors.push('Plan type is required');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      Swal.fire({
        title: 'Validation Error',
        text: errors.join('\n'),
        icon: 'error',
        draggable: true
      });
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        plantype: selectedPlanType,
        bilingcycle: selectedBilingCycle,
        logo: formData.logo || null, // Ensure logo is null if empty
      };
      const response = await axios.patch(`${api}/store/plans/${id}`, submitData);
      Swal.fire({
        title: response?.data?.message || "Plan updated successfully",
        icon: "success",
        draggable: true
      });

      // Reset form after successful submission
      setFormData(defaultPlan);
      setSelectedPlanType(null);
      setSelectedBilingCycle(null);
      setNewFeature('');
      router.push("/vendor/sitesettings/plans");

    } catch (error: any) {
      console.error('Failed to create plan:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create plan. Please try again.';

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        draggable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading){
  return(
  <>
    <div className='text-center mt-10'>
    Loading ...
    </div>
  </>
  )
  }

  return (
    <div className="max-w-full mx-auto p-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vendor">Vendor-dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vendor/sitesettings">Site-Settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/vendor/sitesettings/plans">Plans</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Update Plan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <br />
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Update Plan</h1>
          <p className="text-muted-foreground">
            Manage and track your plans
          </p>
        </div>
        <Button>
          <Link href='/vendor/sitesettings/plans'>See your plans</Link>
        </Button>
      </div>
      <Card className="mb-6">
        <CardHeader>
          {/* <CardTitle className="flex items-center gap-2">
            {editingPlan ? 'Edit Plan' : 'Create New Plan'}
          </CardTitle> */}
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Logo */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.checklogo}
                    onCheckedChange={(checked) => handleSwitchChange('checklogo', checked)}
                  />
                  <Label htmlFor="logo">Logo</Label>
                </div>
                <Input
                  id="logo"
                  placeholder="Enter logo (emoji or URL)"
                  value={formData.logo || ''}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  disabled={!formData.checklogo}
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.checktitle}
                    onCheckedChange={(checked) => handleSwitchChange('checktitle', checked)}
                  />
                  <Label htmlFor="title">Title</Label>
                </div>
                <Input
                  id="title"
                  placeholder="Plan title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!formData.checktitle}
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.checksubtitle}
                    onCheckedChange={(checked) => handleSwitchChange('checksubtitle', checked)}
                  />
                  <Label htmlFor="subtitle">Subtitle</Label>
                </div>
                <Input
                  id="subtitle"
                  placeholder="Plan subtitle"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  disabled={!formData.checksubtitle}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.checkprice}
                    onCheckedChange={(checked) => handleSwitchChange('checkprice', checked)}
                  />
                  <Label htmlFor="price">Price</Label>
                </div>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  disabled={!formData.checkprice}
                />
              </div>

              {/* Billing Cycle */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.checkduration}
                    onCheckedChange={(checked) => handleSwitchChange('checkduration', checked)}
                  />
                  <Label htmlFor="bilingcycle">Billing Cycle</Label>
                </div>
                <Select
                  value={selectedBilingCycle ?? undefined}
                  onValueChange={(value) => setSelectedBilingCycle(value)}
                  disabled={!formData.checkduration}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {bilingcycle.map((cycle, index) => (
                      <SelectItem key={index} value={cycle.type !== null ? String(cycle.type) : ''}>
                        {cycle.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Plan Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={true}
                    onCheckedChange={() => { }}
                  />
                  <Label htmlFor="plantype">Plan Type</Label>
                </div>
                <Select
                  value={selectedPlanType !== null && selectedPlanType !== undefined ? String(selectedPlanType) : undefined}
                  onValueChange={(value) => setSelectedPlanType(parseInt(value))}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {planType.map((plan, index) => (
                      <SelectItem key={index} value={String(plan.type ?? '')}>
                        {plan.type}{" days"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Button Text */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.checkbutton}
                    onCheckedChange={(checked) => handleSwitchChange('checkbutton', checked)}
                  />
                  <Label htmlFor="button">Button Text</Label>
                </div>
                <Input
                  id="button"
                  placeholder="e.g., Get Started, Subscribe"
                  value={formData.button}
                  onChange={(e) => handleInputChange('button', e.target.value)}
                  disabled={!formData.checkbutton}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.checkdescription}
                  onCheckedChange={(checked) => handleSwitchChange('checkdescription', checked)}
                />
                <Label htmlFor="description">Description</Label>
              </div>
              <Textarea
                id="description"
                placeholder="Plan description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!formData.checkdescription}
                rows={3}
              />
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.checkfeatures}
                  onCheckedChange={(checked) => handleSwitchChange('checkfeatures', checked)}
                />
                <Label>Features</Label>
              </div>

              {formData.checkfeatures && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeFeature(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.visibility}
                onCheckedChange={(checked) => handleSwitchChange('visibility', checked)}
              />
              <Label>Visible to users</Label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Updating...' : 'Update Plan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
};

export default PlansManager;