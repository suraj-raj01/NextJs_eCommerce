"use client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoMdCart } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { HiCurrencyRupee } from "react-icons/hi";
import { FaBars } from "react-icons/fa";
import Image from "next/image";
import logo from "@/public/logo/logo.png";
import { AiOutlineClose } from "react-icons/ai";
import bag from "@/public/bag.svg";
import { useRouter } from "next/navigation";

export default function TopNav() {
  const router = useRouter();
  const sidebar = () => {
    document.getElementById("icon").style.display = "none";
    document.getElementById("slidebar").style.display = "block";
    document.getElementById("closebtn").style.display = "block";
  };
  const closeBtn = () => {
    document.getElementById("icon").style.display = "block";
    document.getElementById("slidebar").style.display = "none";
    document.getElementById("closebtn").style.display = "none";
  };

  const home=()=>{
    router.push("/")
  }

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        // className="bg-body-tertiary"
        id="navbar"
      >
        <Container>
          <Navbar.Brand href="#home">
            <FaBars id="icon" onClick={sidebar} />
            <AiOutlineClose
              id="closebtn"
              onClick={closeBtn}
              style={{ display: "none", padding:'5px',borderRadius:'50%',backgroundColor:'ghostwhite',height:'30px',width:'30px' }}
            />
          </Navbar.Brand>
          <Navbar.Brand >
            <Image src={logo} alt="logo" height={40} className="p-0" onClick={home}/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link> */}
              {/* <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown> */}
            </Nav>

            <Form className="d-flex  mr-4">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>

            <Nav id="icons">
              <Nav.Link href="#deets">
                <HiCurrencyRupee className="text-2xl" />
              </Nav.Link>
              <Nav.Link href="#deets">
                <FaRegHeart className="text-2xl" />
              </Nav.Link>
              <Nav.Link href="#deets">
                <IoMdCart className="text-2xl" />
              </Nav.Link>
              <Nav.Link eventKey={2} href="login">
                <FaRegCircleUser className="text-2xl" />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
        <div id="slidebar">
          <div id="link">
            <div
              className="shadow-blue-300 p-2"
              style={{ borderRadius: "5px", border: "1px solid #d7d4d4" }}
            >
              <span className="text-black flex item-center gap-4">
                <p className="text-2xl font-bold">Top Collections</p>
                <Image src={bag} alt="bag" />
              </span>
              <p className="font-bold ml-2 hover:text-red-600 cursor-pointer">Same Day Delivery Gifts</p>
              <p className="font-bold ml-2 hover:text-red-600 cursor-pointer">Birthday Gifts</p>
              <p className="font-bold ml-2 hover:text-red-600 cursor-pointer">Personalized Gifts</p>
            </div>
            <p className="font-bold text-gray-400 text-xs mt-2">Shop By </p>
            <Form.Select aria-label="Default select example">
              <option>Personal Occasions</option>
              <option value="1">Birthday Gifts</option>
              <option value="2">Anniversary Gifts</option>
              <option value="3">Wedding & Engagement</option>
              <option value="3">Best Wishes</option>
            </Form.Select>

            <Form.Select aria-label="Default select example">
              <option>Categories</option>
              <option value="1">Cakes</option>
              <option value="2">Flowers</option>
              <option value="3">Plants</option>
              <option value="3">Home & Living</option>
              <option value="3">Fashion & Lifestyle</option>
              <option value="3">Toys & Games & Lifestyle</option>
            </Form.Select>

            <Form.Select aria-label="Default select example">
              <option>Festivals</option>
              <option value="1">Easter</option>
              <option value="2">Akshaya Tritiya</option>
              <option value="3">Rakhi</option>
              <option value="3">Janmashtami</option>
              <option value="3">Ganesh Chaturthi</option>
              <option value="3">Dussehra</option>
              <option value="3">Karwa Chauth</option>
              <option value="3">Dhanteras</option>
              <option value="3">Diwali</option>
            </Form.Select>

            <Form.Select aria-label="Default select example">
              <option>Special Days</option>
              <option value="1">Mother's Day</option>
              <option value="2">Father's Day</option>
              <option value="3">Friendship's Day</option>
              <option value="3">Independence Day</option>
              <option value="3">Teacher's Day</option>
              <option value="3">Boss Day</option>
              <option value="3">Children's Day</option>
              <option value="3">Valentines Day</option>
              <option value="3">Women's Day</option>
            </Form.Select>

            <Form.Select aria-label="Default select example">
              <option>Recipient</option>
              <option value="1">Him</option>
              <option value="2">Her</option>
              <option value="3">Teen</option>
              <option value="3">Kids</option>
            </Form.Select>
           
          </div>
        </div>
      </Navbar>
    </>
  );
}
