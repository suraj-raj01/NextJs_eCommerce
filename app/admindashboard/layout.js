'use client'
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { FaRegCircleUser } from "react-icons/fa6";
import { AiFillDashboard } from "react-icons/ai";
import { RiInsertColumnRight } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import DashbaordFooter from "../components/DashbaordFooter";
export default function AdminLayout({ children }) {

    const sidebar=()=>{
     document.getElementById("vendordashboard").style.display='block'
     document.getElementById("menu").style.display='none'
     document.getElementById("cancelbtn").style.display='block'
    }

    const cancelbtn=()=>{
        document.getElementById("vendordashboard").style.display='none'
        document.getElementById("menu").style.display='block'
        document.getElementById("cancelbtn").style.display='none'
    }

    return <main>
        <header id="vendor-nav">
        <div className="flex items-center content-center gap-3">
        <FaBars onClick={sidebar} id="menu"/> <ImCancelCircle id="cancelbtn" onClick={cancelbtn}/>
        ADMIN DASHBOARD
        </div>
        <FaRegCircleUser />
        </header>
        <div id="vendor-main">
        <div id="vendordashboard">
            <Link href='#' className="flex items-center gap-3 text-2xs"><AiFillDashboard />Dashboard</Link>
            <Link href='#' className="flex items-center gap-3 text-2xs"><RiInsertColumnRight />Insert</Link>
            <Link href='#' className="flex items-center gap-3 text-2xs"><FaUserGroup/>See Vendors</Link>
            <Link href='#' className="flex items-center gap-3 text-2xs"><FaEdit />Update</Link>
        </div>
        {children}
        </div>
        <DashbaordFooter/>
    </main>
  }