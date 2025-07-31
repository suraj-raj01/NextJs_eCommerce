'use client'
import React, { useState, useEffect } from 'react'
import { Input } from "../../../components/ui/input"
import { useRouter } from 'next/navigation'
import { Button } from "../../../components/ui/button"
import axios from 'axios'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card"
import Swal from 'sweetalert2'
import { loginSchema,LoginFormData} from './../../validation/loginSchema';

export default function Login() {
    const router = useRouter()

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        console.log('Form Data:', formData)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
            result.error.errors.forEach((err) => {
                const field = err.path[0] as keyof LoginFormData;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        console.log('Validated Data:', result.data);

        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.post(`${api}/vendor/auth/login`, formData)
            Swal.fire({
                title: response.data.message || 'User login successfully',
                icon: "success",
                draggable: true
            });
            setFormData({
                email: '',
                password: ''
            })
            localStorage.setItem("token",response.data.token)
            localStorage.setItem("user",JSON.stringify(response.data))
            // localStorage.setItem("id",response.data.user.id)
            // localStorage.setItem("email",response.data.user.email)
            // localStorage.setItem("role",response.data.user.role)
            router.push("/vendor")
            // router.back();
        } catch (error) {
            console.error('Error creating user:', error)
        }
    }


    return (
        <>
            {/* <h1>Create User</h1> */}
            <div className='flex items-center justify-center h-screen'>
                <Card className="w-full max-w-md mx-auto ">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-center mb-3">Login Form</CardTitle>
                    </CardHeader>

                    <CardContent>
                       
                        <Input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        <br />

                        <Input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        <br />

                        
                        <Button variant="outline" type="submit" className="w-full">Submit</Button>
                    </CardContent>

                    <CardFooter />
                </form>
            </Card>
            </div>
        </>
    )
}


