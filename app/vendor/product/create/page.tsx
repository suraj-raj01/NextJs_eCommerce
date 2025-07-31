'use client'
import React, {useState } from 'react'
import { Button } from '../../../../components/ui/button'
import { Input } from "../../../../components/ui/input"
import axios from 'axios'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card"
// import { productSchema, ProductFormData } from '../../../validation/productSchema'
import Swal from 'sweetalert2'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb"


export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: Number(0),
    stock: Number(0),
    images:[""],
    defaultImage:'',
    colors:[""],
    userId: 'cmbq9gpaq0001mr08isd1h0p1'
  });

  // const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form Data Before Validation:', formData);
    // const result = productSchema.safeParse(formData);
    // if (!result.success) {
    //   const fieldErrors: Partial<Record<keyof ProductFormData, string>> = {};
    //   result.error.errors.forEach((err) => {
    //     const field = err.path[0] as keyof ProductFormData;
    //     fieldErrors[field] = err.message;
    //   });
    //   setErrors(fieldErrors);
    //   return;
    // }

    // setErrors({});
    // console.log('Validated Data:', result);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await axios.post(`${api}/vendor/product`, formData);
      Swal.fire({
        title: response.data.message,
        icon: "success",
        draggable: true
      });
      console.log('Permission submitted:', response);
      setFormData({
        name: '',
        category: '',
        description: '',
        price: Number(0),
        stock: Number(0),
        images:[""],
        defaultImage:'',
        colors:[""],
        userId: '316e87d3-5ee5-4870-8636-35e9a3efcc4f'
      });
    } catch (error) {
      console.error('Error submitting Product:', error);
      alert('Failed to submit Product. Please try again.');
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
    <>
     <div className='w-full p-3'>
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
            <BreadcrumbLink href="/vendor/product">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Insert Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
       <Card className="w-full max-w-full p-5 mx-auto mt-8">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-2">
            <CardTitle className="text-center mb-3 text-2xl p-3">Insert Product</CardTitle>
          </CardHeader>

          <CardContent>
            <Input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />
            {/* {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>} */}
            <br />

            <Input
              type="text"
              name="category"
              placeholder="Enter category"
              value={formData.category}
              onChange={handleChange}
            />
            {/* {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>} */}
            <br />

            <Input
              type="text"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            />
            {/* {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>} */}
            <br />

            <Input
              type="number"
              name="price"
              placeholder="Enter Price"
              value={formData.price}
              onChange={handleChange}
            />
            {/* {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>} */}
            <br />

            <Input
              type="number"
              name="stock"
              placeholder="Enter stock"
              value={formData.stock}
              onChange={handleChange}
            />
            {/* {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>} */}
            <br />
            <Input
              type="text"
              name="defaultImage"
              placeholder="image url"
              value={formData.defaultImage}
              onChange={handleChange}
            />
            {/* {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>} */}
            <br />

            <Button variant="outline" type="submit" className="w-full mb-4">Submit</Button>
          </CardContent>

          <CardFooter />
        </form>
      </Card>
     </div>
    {/* <ProductTable/> */}
    </>
  )
}

