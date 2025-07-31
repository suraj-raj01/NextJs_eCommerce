
'use client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { EllipsisVertical, SquarePen, Trash, Loader2 } from 'lucide-react'
import axios from 'axios'
import { Input } from '../../../components/ui/input'
import { Button } from "../../../components/ui/button"
import Swal from 'sweetalert2'
import { RotateCw } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"

export default function Selling() {
    interface ProductStats {
        quantity: number;
        revenue: number;
    }

    interface SellingData {
        id: string;
        totalProductsSold: number;
        totalRevenue: number;
        productStats: Record<string, ProductStats>;
        isPaid: boolean;
    }

    const [selling, setSelling] = useState<SellingData>({
        id: '',
        totalProductsSold: 0,
        totalRevenue: 0,
        productStats: {},
        isPaid: false
    })
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = React.useState<any>({
        "isPaid": false
    });
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);


    const loadSelling = async () => {
        try {
            setLoading(true)
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.get(`${api}/vendor/selling?page=${page}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log('Selling Data loaded:', response.data)
            setSelling(response.data)
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching selling:', error)
            alert('Failed to load selling. Please try again later.')
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSelling()
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, [page, limit])

    const updateChange = async (id: string) => {
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            await axios.patch(`${api}/vendor/selling/${id}`, { isPaid: formData.isPaid },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            Swal.fire({
                title: "selling updated successfully",
                icon: "success",
                draggable: true
            });
            loadSelling();
            setSheetOpen(false)
        } catch (error) {
            console.error('Error deleting role:', error)

            Swal.fire({
                title: "Failed to Update selling. Please try again.",
                icon: "warning",
                draggable: true
            });
        }
    }

    const deleteOrder = async (id: string) => {
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.delete(`${api}/vendor/selling/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            Swal.fire({
                title: response.data.message,
                icon: "success",
                draggable: true
            });
            loadSelling()
        } catch (error) {
            console.error('Error deleting role:', error)
            alert('Failed to delete role. Please try again.')
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center mt-3 p-2 w-full">

            </div>

            {loading ? (
                <p className="text-gray-500">Loading selling...</p>
            ) : (
                <div className="w-full p-4">
                    <Table className="mt-5 p-3">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Total Product Sold   </TableHead>
                                <TableHead>Total Revenue</TableHead>
                                <TableHead>Product Stats</TableHead>
                                <TableHead className="text-end">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow >
                                <TableCell>{selling?.totalProductsSold}</TableCell>
                                <TableCell>{selling?.totalRevenue}</TableCell>
                                <TableCell>
                                    {selling.productStats && typeof selling.productStats === 'object' ? (
                                        Object.entries(selling.productStats).map(([name, stats]) => (
                                            <div key={name}>
                                                - {name}: {stats.quantity} sold, ${Number(stats.revenue).toFixed(2)} revenue
                                            </div>
                                        ))
                                    ) : (
                                        <div>No product statistics available.</div>
                                    )}
                                </TableCell>


                                <TableCell className='text-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <EllipsisVertical />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setSheetOpen(true)}>
                                                Edit <SquarePen className="ml-2" />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => deleteOrder(selling.id)}>
                                                Delete <Trash className="ml-2" />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Dialog open={isSheetOpen} onOpenChange={setSheetOpen}>
                                        <form>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Update Order Status</DialogTitle>
                                                </DialogHeader>


                                                <div className="grid gap-4 mt-3">
                                                    <div className="grid gap-3">
                                                        {/* <Label htmlFor="name-1">Role</Label> */}
                                                        <form>
                                                            <Label htmlFor="terms" className='mb-3'>isPaid</Label>
                                                            <Input
                                                                id="name-1"
                                                                name="isPaid"
                                                                value={formData.isPaid}
                                                                placeholder='status'
                                                                onChange={(e) => { setFormData({ ...formData, isPaid: e.target.value }) }}

                                                            />
                                                            <br />
                                                        </form>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button onClick={() => { updateChange(selling.id) }}>Save changes</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </form>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <br />
                </div>
            )
}
        </>
    )
}