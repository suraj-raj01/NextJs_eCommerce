"use client";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Image from "next/image";
// import googlelogo from "@/public/logo/google.svg";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import LoginNav from "../components/LoginNav";
import { TbDeviceMobileMessage } from "react-icons/tb";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default async function page() {

  const loadData=async()=>{
     let api = "http://localhost:3000/api/getuser";
     try {
      const res = await axios.get(api);
      console.log(res.data);
     } catch (error) {
      console.error("Error fetching data:", error);
     }
  }

  // 



  // const [validated, setValidated] = useState(false);
  // const router = useRouter();
  // const user = useUser();
  // console.log(user);

  // const handleSubmit = (event) => {
  //   const form = event.currentTarget;
  //   if (form.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //   }

  //   setValidated(true);
  // };

  // const signUp = () => {
  //   router.push("/signup");
  // };


  return (
    <div>
      <LoginNav />
      {/* <div id="form">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <p className="text-2xl font-bold">Sign In</p>
          <p className="font-bold">
            Dont't have an account?{" "}
            <span className="text-blue-600 cursor-pointer" onClick={signUp}>
              SignUp
            </span>
          </p>
          <Form.Group controlId="validationCustom01">
            <Form.Label className="font-bold">EmailId*</Form.Label>
            <Form.Control required type="email" placeholder="enter email" />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom02">
            <Form.Label className="font-bold">Password*</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="enter password"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="validationCustom02">
            <Form.Label className="font-bold">Role*</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Select Role*</option>
              <option value="1">User</option>
              <option value="2">Vendor</option>
              <option value="3">Admin</option>
            </Form.Select>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>

          <button type="submit">Submit form</button>
          <p className="text-center p-3 font-bold">or sign in</p>
          <div id="auth">
            <div id="box">
              <TbDeviceMobileMessage />
              <span className="font-bold cursor-pointer">Via OTP</span>{" "}
            </div>
            <div id="box">
              <Image src={googlelogo} alt="google logo" />
              <span className="font-bold cursor-pointer">Google</span>
            </div>
            <div id="box">
              <FaGithub />
              <span className="font-bold cursor-pointer" id="github">
                GitHub
              </span>
            </div>
          </div>
        </Form>
      </div> */}
      <button onClick={loadData}>Load Data</button>
    </div>
  );
};


