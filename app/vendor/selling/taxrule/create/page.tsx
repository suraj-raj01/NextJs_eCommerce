'use client'
import React, { useState, useEffect } from 'react'
import { Input } from "../../../../../components/ui/input"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../../../components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../../components/ui/select"
import { Button } from "../../../../../components/ui/button"
import { taxRuleSchema, TaxRuleFormData } from '../../../../validation/taxruleSchema'
import axios from 'axios'
import Countries from '../../../Countries'
import Swal from 'sweetalert2'
import { Label } from "../../../../../components/ui/label"

const CreateTaxRule = () => {
    const [formData, setFormData] = useState<TaxRuleFormData>({
        country: '',
        state: '',
        type: '',
        rate: Number(0)
    });
    const [formDataUpdate, setformDataUpdate] = useState<TaxRuleFormData>({
        country: '',
        state: '',
        type: '',
        rate: Number(0)
    });
    const [errors, setErrors] = useState<Partial<Record<keyof TaxRuleFormData, string>>>({});
    const [countries, setCountries] = useState<string[]>([]);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setCountries(Countries);
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = taxRuleSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof TaxRuleFormData, string>> = {};
            result.error.errors.forEach((err) => {
                const field = err.path[0] as keyof TaxRuleFormData;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        console.log('Validated Data:', result.data);

        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.post(`${api}/vendor/taxrule`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log('Tax Created created:', response.data)
            Swal.fire({
                title: response.data.message || 'Tax-rule created successfully',
                icon: "success",
                draggable: true
            });
            setFormData({
                country: '',
                state: '',
                type: '',
                rate: Number(0)
            })

        } catch (error) {
            console.error('Error creating user:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        console.log('Form Data:', formData)
    }
    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setformDataUpdate(prev => ({
            ...prev,
            [name]: value
        }))
        console.log('Update Form Data:', formDataUpdate)
    }


    return (
        <div className='p-3'>
            <Card className="w-full max-w-full mx-auto mt-10">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-center mb-3">Create Taxrule</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Label htmlFor="text" className='py-3 text-gray-400'>select country *</Label>
                        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((country) => (
                                    <SelectItem key={country} value={country} defaultValue="india">
                                        {country}
                                    </SelectItem>
                                ))}
                                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                            </SelectContent>
                        </Select>
                        
                        <Label htmlFor="text" className='py-3 text-gray-400'>enter state *</Label>
                        <Input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                        
                        <Label htmlFor="text" className='py-3 text-gray-400'>enter tax type *</Label>
                        <Input
                            type="text"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        />
                        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                        
                        <Label htmlFor="text" className='py-3 text-gray-400'>enter tax rate *</Label>
                        <Input
                            type="number"
                            name="rate"
                            value={formData.rate}
                            onChange={handleChange}
                            required
                        />
                        {errors.rate && <p className="text-red-500 text-sm mt-1">{errors.rate}</p>}
                        <br />
                        <Button variant="outline" type="submit" className="w-full">Submit</Button>
                    </CardContent>

                    <CardFooter />
                </form>
            </Card>
          
        </div>
    )
}

export default CreateTaxRule