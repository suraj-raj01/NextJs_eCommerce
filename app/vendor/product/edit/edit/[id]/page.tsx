'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios';
import { Input } from "../../../../../../components/ui/input"
import { Button } from "../../../../../../components/ui/button"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card"
import Swal from 'sweetalert2';
const UpdateProduct = () => {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [updateData, setUpdateData] = React.useState({})
  const [formData, setFormData] = React.useState({
    name: '',
    category: '',
    description: '',
    price: Number(0),
    stock: Number(0),
    userId: 'cmbkqjgp10007mr2o704clv9e'
  });

  console.log('Update Data:', updateData);
  const [token, setToken] = useState<string | null>(null);

  const fetchUpdateData = async () => {
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const response = await axios.get(`${api}/vendor/product/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('Response:', response.data)
      setUpdateData(response.data[0]);
      setFormData(response.data[0]);
    } catch (error) {
      console.error('Error fetching product data:', error)
    }
  }

  useEffect(() => {
    fetchUpdateData()
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, [id])

  const updateChange = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await axios.patch(`${api}/vendor/product/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      Swal.fire({
        title: response.data.message,
        icon: "success",
        draggable: true
      });
      console.log('Permission submitted:', response);
      fetchUpdateData();
      setFormData({
        name: '',
        category: '',
        description: '',
        price: Number(0),
        stock: Number(0),
        userId: ''
      });
      router.push("/vendor/product");
    } catch (error) {
      console.error('Error submitting permission:', error);
      alert('Failed to submit permission. Please try again.');
      return;
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    console.log('Form Data:', formData);
  }

  return (
    <div className='w-full p-5'>
      <Card className="w-full max-w-full p-5 mt-6 mx-auto">
        <form onSubmit={updateChange} className="space-y-4">
          <CardHeader className="space-y-2">
            <CardTitle className="text-center mb-3">Edit Product</CardTitle>
          </CardHeader>

          <CardContent>
            <Input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {/* {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>} */}
            <br />

            <Input
              type="text"
              name="category"
              placeholder="Enter category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            {/* {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>} */}
            <br />

            <Input
              type="text"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            {/* {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>} */}
            <br />

            <Input
              type="number"
              name="price"
              placeholder="Enter Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            {/* {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>} */}
            <br />

            <Input
              type="number"
              name="stock"
              placeholder="Enter stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
            {/* {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>} */}
            <br />

            <Button variant="outline" className="w-full" type='submit'>Submit</Button>
          </CardContent>

          <CardFooter />
        </form>
      </Card>
    </div>
  )
}

export default UpdateProduct