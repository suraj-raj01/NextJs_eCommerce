"use client";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Image from "next/image";
import googlelogo from "@/public/logo/google.svg"
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import LoginNav from "../components/LoginNav";

const page = () => {
  const [validated, setValidated] = useState(false);
  const router = useRouter();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  const signUp=()=>{
    router.push("/signup");
  }

  return (
    <div>
      <LoginNav/>
     <div id="form">
     <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <p className="text-2xl font-bold">Sign In</p>
        <p className="font-bold">Dont't have an account? <span className="text-blue-600 cursor-pointer" onClick={signUp}>SignUp</span></p>
        <Form.Group controlId="validationCustom01">
          <Form.Label className="font-bold">EmailId*</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="enter email"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group  controlId="validationCustom02">
          <Form.Label className="font-bold">Password*</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="enter password"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <button type="submit">Submit form</button>
        <p className="text-center p-3 font-bold">or sign in</p>
        <div id="auth">
          <div id="box"></div>
          <div id="box"><Image src={googlelogo} alt="google logo"/><span className="font-bold cursor-pointer">Google</span></div>
          <div id="box"><FaGithub /><span className="font-bold cursor-pointer">GitHub</span> </div>
        </div>
      </Form>
     </div>
    </div>
  );
};

export default page;
