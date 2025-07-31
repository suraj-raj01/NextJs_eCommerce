'use client'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { EllipsisVertical, SquarePen, Trash, Loader2 } from 'lucide-react'
import axios from 'axios'
import { Input } from '../../../../components/ui/input'
import { Button } from "../../../../components/ui/button"
import Swal from 'sweetalert2'
import { useParams } from 'next/navigation'
import { RotateCw } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog"
import { Label } from "../../../../components/ui/label"

export default function Invoice() {
  const [invoice, setInvoice] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = React.useState<any>({
    "isPaid": false
  });
  const [isSheetOpen, setSheetOpen] = useState(false);
  const params = useParams();
  const id = params.id;
  const [token, setToken] = useState<string | null>(null);

  const loadInvoice = async () => {
    try {
      setLoading(true)
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const response = await axios.get(`${api}/vendor/invoice/${id}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('Order loaded:', response.data)
      setInvoice(response.data)
    } catch (error) {
      console.error('Error fetching invoice:', error)
      alert('Failed to load invoice. Please try again later.')
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvoice()
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const updateChange = async (id: string) => {
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      await axios.patch(`${api}/vendor/invoice/${id}`, { isPaid: formData.isPaid },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      )
      Swal.fire({
        title: "Invoice updated successfully",
        icon: "success",
        draggable: true
      });
      loadInvoice();
      setSheetOpen(false)
    } catch (error) {
      console.error('Error deleting role:', error)

      Swal.fire({
        title: "Failed to Update Order. Please try again.",
        icon: "warning",
        draggable: true
      });
    }
  }

  const deleteOrder = async (id: string) => {
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const response = await axios.delete(`${api}/vendor/invoice/${id}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      Swal.fire({
        title: response.data.message,
        icon: "success",
        draggable: true
      });
      loadInvoice()
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
        <p className="text-gray-500">Loading invoice...</p>
      ) : (
        <div className="w-full p-4">
          <Table className="mt-5 p-3">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>IsPaid</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow >
                <TableCell>{invoice?.customer?.name}</TableCell>
                <TableCell>{invoice?.customer?.email}</TableCell>
                <TableCell>{invoice?.amount}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>{invoice.products}</TableCell>
                <TableCell>{invoice.isPaid === true ? "True" : "False"}</TableCell>
                <TableCell>{invoice.isPaid}</TableCell>
                <TableCell className='text-start'>
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
                      <DropdownMenuItem onClick={() => deleteOrder(invoice.id)}>
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
                          <Button onClick={() => { updateChange(invoice.id) }}>Save changes</Button>
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
      )}
    </>
  )
}
