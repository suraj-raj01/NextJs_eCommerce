"use client";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import TopNav from "../components/TopNav";
import Image from "next/image";
import googlelogo from "@/public/logo/google.svg";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import google from "@/public/logo/google.svg";

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

  const signin = () => {
    router.push("/login");
  };

  return (
    <div>
      <TopNav />
      <div id="signup-form">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <p className="text-2xl font-bold">Sign Up</p>
          <p className="font-bold">
            Already have an account?{" "}
            <span className="text-blue-600 cursor-pointer" onClick={signin}>
              SignIn
            </span>
          </p>

          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Form.Label className="font-bold">Title*</Form.Label>
              <Form.Select aria-label="Default select example">
                <option>Select</option>
                <option value="1">Mr.</option>
                <option value="2">Ms.</option>
              </Form.Select>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="3"
              controlId="validationCustom02"
              id="name"
            >
              <Form.Label className="font-bold">Full Name*</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="full name"
                id="name"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustom03"
              id="email"
            >
              <Form.Label className="font-bold">Email ID*</Form.Label>
              <Form.Control type="email" placeholder="Email ID" required />
              <Form.Control.Feedback type="invalid">
                Please provide a valid city.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustom04"
              id="password"
            >
              <Form.Label className="font-bold">Password*</Form.Label>
              <Form.Control type="password" placeholder="Password" required />
              <Form.Control.Feedback type="invalid">
                Please provide a valid state.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustom03"
              id="email"
            >
              <Form.Label className="font-bold">Mobile Number*</Form.Label>
              <Form.Control type="number" placeholder="Mobile No" required />
              <Form.Control.Feedback type="invalid">
                Please provide a valid city.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="6"
              controlId="validationCustom04"
              id="password"
            >
              <Form.Label className="font-bold">Date of Birth</Form.Label>
              <Form.Control type="date" placeholder="Date Of Birth" required />
              <Form.Control.Feedback type="invalid">
                Please provide a valid state.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3">
            <Form.Check
              required
              label="I Agree to recieve special updates,offers, permotions from IGP.com"
              feedback="You must agree before submitting."
              feedbackType="invalid"
            />
          </Form.Group>

          <button type="submit">SIGN UP</button>
          <p className="text-center p-3 font-bold">or sign in</p>
          <div id="auth">
            <div id="box"></div>
            <div id="box">
              <Image src={google} alt="google logo" />
              <span className="font-bold cursor-pointer">Google</span>
            </div>
            <div id="box">
              <FaGithub />
              <span className="font-bold cursor-pointer">GitHub</span>{" "}
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default page;
