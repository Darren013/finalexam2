import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";

export default function ProfileSettings() {
    const { user } = useContext(UserContext);

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        // Fetch user details from the server when the component loads
        fetch("http://localhost:4000/users/details", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token is stored in localStorage
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setFirstName(data.firstName);
                    setMiddleName(data.middleName);
                    setLastName(data.lastName);
                    setEmail(data.email);
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to load user data.",
                        icon: "error",
                    });
                }
            });
    }, []);

    function updatePassword(e) {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire({
                title: "Error",
                text: "Passwords do not match.",
                icon: "error",
            });
            return;
        }

        fetch("http://localhost:4000/users/update-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ newPassword, confirmPassword }),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.message === "Password updated successfully.") {
                    Swal.fire({
                        title: "Success",
                        text: result.message,
                        icon: "success",
                    });
                    setNewPassword("");
                    setConfirmPassword("");
                } else {
                    Swal.fire({
                        title: "Error",
                        text: result.message || "Failed to update password.",
                        icon: "error",
                    });
                }
            });
    }

    return user.id !== null ? (
        <Container fluid className="vh-100">
            <Row>
                <Col className="vh-100 col-12 d-flex flex-column align-items-center justify-content-center">
                    <h1 className="display-5 fw-bold mb-5">Profile Settings</h1>

                    <Form className="w-50 p-5 shadow rounded-3 border-bottom border-3 border-warning">
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={firstName}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Middle Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={middleName}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} readOnly />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                value={newPassword}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                value={confirmPassword}
                            />
                        </Form.Group>

                        <Button
                            variant="warning"
                            className="w-100 rounded-pill"
                            onClick={updatePassword}
                        >
                            Update Password
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    ) : (
        <Navigate to="/login" />
    );
}
