'use client'
import React, { useState, useEffect } from 'react'
import { Input } from "../../../../components/ui/input"
import { Button } from "../../../../components/ui/button"
import axios from 'axios'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../../components/ui/card"

import { UserRound } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select"
import { userSchema, UserFormData } from '../../../validation/userSchema'
import Swal from 'sweetalert2'
import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb"

const CreateUser = () => {
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        password: '',
        roleId: ''
    });
    const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
    const [roles, setRoles] = useState([])

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${api}/vendor/user`)
            setUsers(response.data)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

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
        console.log(formData)
        const result = userSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof UserFormData, string>> = {};
            result.error.errors.forEach((err) => {
                const field = err.path[0] as keyof UserFormData;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        console.log('Validated Data:', result.data);

        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.post(`${api}/vendor/user`, formData)
            console.log('User created:', response.data)
            Swal.fire({
                title: response.data.message || 'User created successfully',
                icon: "success",
                draggable: true
            });
            setFormData({
                name: '',
                email: '',
                password: '',
                roleId: ''
            })
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error)
        }
    }

    const loadRoles = async () => {
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.get(`${api}/vendor/role`)
            setRoles(response.data.roles)
            console.log("roless", response.data.roles)
        } catch (error) {
            console.error('Error fetching roles:', error)
            alert('Failed to load roles. Please try again later.')
        }
    }

    useEffect(() => {
        loadRoles();
    }, [])

    return (
        <div className="p-3">
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
                            <BreadcrumbLink href="/vendor/users">Users</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Create-user</BreadcrumbPage>    
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <br />
            <div className="flex items-center justify-between mb-6 ">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create user</h1>
                    <p className="text-muted-foreground">
                        Manage and track all users
                    </p>
                </div>
                <Button><UserRound />
                    <Link href="/vendor/users">See Users</Link>
                </Button>
            </div>
            <br />
            <Card className="w-full max-w-1/2 mx-auto ">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-center mb-3">Create User</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        <br />

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

                        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, roleId: value }))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((item: { id: string; name: string }, index: number) => (
                                    <SelectItem key={index} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>

                            {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>}
                        </Select>
                        <br />
                        <Button variant="outline" type="submit" className="w-full">Submit</Button>
                    </CardContent>

                    <CardFooter />
                </form>
            </Card>
            <br />

        </div>
    )
}

export default CreateUser
