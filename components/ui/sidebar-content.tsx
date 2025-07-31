'use client'
import { useRouter } from "next/navigation";
import { House } from "lucide-react";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectTrigger,
} from "../../components/ui/select"
export default function SidebarContent() {
    const router = useRouter();
    const home = () => {
        router.push("/");
    }
    return (
        <>
            <div className="font-bold text-white mt-4 mb-5 text-2xl text-center flex items-center justify-center gap-2"><House onClick={home} />DASHBOARD</div>
            <div >
                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        {/* <SelectValue placeholder="Permission" /> */}
                        <Link href="/dashboard/permission" className="font-bold block px-4 py-2 text-sm">
                            See Permission
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/permission" className="font-bold block px-4 py-2 text-sm">
                            See Permission
                        </Link>
                        <Link href="/dashboard/createpermission" className="font-bold block px-4 py-2 text-sm">
                            Create Permissions
                        </Link>
                        <Link href="/dashboard/managepermission" className="font-bold block px-4 py-2 text-sm">
                            Manage Permissions
                        </Link>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        {/* <SelectValue placeholder="Permission" /> */}
                        <Link href="/dashboard/roles" className="font-bold block px-4 py-2 text-sm">
                            See Role
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/roles" className="font-bold block px-4 py-2 text-sm">
                            See Roles
                        </Link>
                        <Link href="/dashboard/createrole" className="font-bold block px-4 py-2 text-sm">
                            Create Roles
                        </Link>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        <Link href="/dashboard/users" className="font-bold block px-4 py-2 text-sm">
                            Create Users
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/users" className="font-bold block px-4 py-2 text-sm">
                            See Users
                        </Link>
                        <Link href="/dashboard/createuser" className="font-bold block px-4 py-2 text-sm">
                            Create Users
                        </Link>
                        <Link href="/dashboard/assignrole" className="font-bold block px-4 py-2 text-sm">
                            Assign Role
                        </Link>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        <Link href="/dashboard/taxrule" className="font-bold block px-4 py-2 text-sm">
                            Tax Management
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/taxrule" className="font-bold block px-4 py-2 text-sm">
                            Tax Rules
                        </Link>
                        <Link href="/dashboard/createtaxrule" className="font-bold block px-4 py-2 text-sm">
                            Tax Rule Create
                        </Link>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        <Link href="/dashboard/products" className="font-bold block px-4 py-2 text-sm">
                            Products
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/products" className="font-bold block px-4 py-2 text-sm">
                            Products
                        </Link>
                        <Link href="/dashboard/addproducts" className="font-bold block px-4 py-2 text-sm">
                            Add Products
                        </Link>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        <Link href="/dashboard/customers" className="font-bold block px-4 py-2 text-sm">
                            Customers
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/customers" className="font-bold block px-4 py-2 text-sm">
                            Customers
                        </Link>

                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        <Link href="/dashboard/review" className="font-bold block px-4 py-2 text-sm">
                            Review
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/review" className="font-bold block px-4 py-2 text-sm">
                            Review
                        </Link>

                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        <Link href="/dashboard/orders" className="font-bold block px-4 py-2 text-sm">
                            Order
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/orders" className="font-bold block px-4 py-2 text-sm">
                            Order
                        </Link>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        <Link href="/dashboard/complaint" className="font-bold block px-4 py-2 text-sm">
                            Complaint
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/complaint" className="font-bold block px-4 py-2 text-sm">
                            Complaint
                        </Link>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        <Link href="/dashboard/selling" className="font-bold block px-4 py-2 text-sm">
                            Selling
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/selling" className="font-bold block px-4 py-2 text-sm">
                            Selling
                        </Link>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        <Link href="/dashboard/returnrequest" className="font-bold block px-4 py-2 text-sm">
                            Return Request
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/returnrequest" className="font-bold block px-4 py-2 text-sm">
                            Return Request
                        </Link>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className=" border-none w-full mb-2 text-start bg-none">
                        <Link href="/dashboard/refundrequest" className="font-bold block px-4 py-2 text-sm">
                            Refund Request
                        </Link>
                    </SelectTrigger>
                    <SelectContent>
                        <Link href="/dashboard/refundrequest" className="font-bold block px-4 py-2 text-sm">
                            Refund Request
                        </Link>
                    </SelectContent>
                </Select>
                {/* <Link href="/dashboard/settings" className="text-gray-500 hover:text-gray-900 dark:hover:text-white block px-4 py-2 text-sm">
                Settings
            </Link> */}
            </div>
        </>
    )
}