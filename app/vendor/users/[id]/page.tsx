'use client'
import React, { useState, useEffect } from 'react'
import { Input } from "../../../../components/ui/input"
import { useParams, useRouter } from 'next/navigation'
import { Button } from "../../../../components/ui/button"
import axios from 'axios'
import Swal from "sweetalert2"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../../components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select"
import { userSchema } from '../../../validation/userSchema'
import { Skeleton } from '../../../../components/ui/skeleton'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb"

export default function EditUser() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        roleId: '',
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [roles, setRoles] = useState([])
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const { data } = await axios.get(`${api}/vendor/role`)
                console.log(data.roles)
                setRoles(data.roles || [])
            } catch (error) {
                console.error('Error fetching roles:', error)
            }
        }
        fetchRoles();
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${api}/vendor/user/${id}`)
                const user = response.data
                console.log('Fetched user data:', response.data)
                if (user) {
                    setFormData({
                        name: user[0].name || '',
                        email: user[0].email || '',
                        password: user[0].password || '',
                        roleId: user[0].roleId || '',
                    })
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error)
            } finally {
                setLoading(false)
            }
        }
        if (id) {
            fetchUser()
        }
    }, [id, api])

    const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoading(true)
            await axios.patch(`${api}/vendor/user/${id}`, formData)
            Swal.fire({
                title: "User updated successfully",
                icon: "success",
                draggable: true
            });
            router.push('/vendor/users')
        } catch (error) {
            console.error('Error updating user:', error)
            alert('Failed to update user')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className='p-3'>
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
                        <BreadcrumbPage>Update-user</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <br />
            <div className="flex justify-between items-center mb-4">
                <div>
                    {loading ? (
                        <>
                            <Skeleton className="h-9 w-32 mb-2" />
                            <Skeleton className="h-5 w-48" />
                        </>
                    ) : (
                        <>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Update role to user</h1>
                                <p className="text-muted-foreground">
                                    Manage and track all users
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {loading ? (
                    <Skeleton className="h-10 w-32" />
                ) : (
                    <Button>
                        <Link href='/vendor/users/create'>Create New User</Link>
                    </Button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Skeleton className="mt-15 h-80 w-1/2" />
                </div>
            ) : (
                <Card className="w-full max-w-1/2 mx-auto mt-10">
                    <form onSubmit={updateUser}>
                        <CardHeader>
                            <CardTitle className='text-center mb-3'>Update User</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                type="text"
                                name="name"
                                placeholder="Enter Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                required
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleChange}
                            />

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

                                {/* {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>} */}
                            </Select>
                            <Button variant="outline" type="submit" className='w-full mt-2' disabled={loading}>
                                {loading ? 'Loading...' : 'Submit'}
                            </Button>
                        </CardContent>
                        <CardFooter />
                    </form>
                </Card>
            )}

        </div>
    )
}
