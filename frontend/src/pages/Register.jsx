import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/auth/register", form);
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="p-6 shadow-lg rounded-2xl bg-black w-80">
                <h2 className="text-xl mb-4">Register</h2>
                <input className="w-full mb-2 p-2 border" placeholder="Name"
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="w-full mb-2 p-2 border" placeholder="Email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input type="password" className="w-full mb-2 p-2 border" placeholder="Password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button className="w-full bg-green-500 text-white p-2">Register</button>

                <p className="text-sm mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/login" className="text-blue-500 underline">
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
}