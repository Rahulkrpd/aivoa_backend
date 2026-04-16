import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/auth/login", form);
    
            login(data.token);
    
            // ✅ Decode JWT
            const payload = JSON.parse(atob(data.token.split(".")[1]));
    
            // ✅ Redirect based on role
            if (payload.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
    
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center ">
            <form onSubmit={handleSubmit} className="p-6 shadow-lg rounded-2xl bg-black w-80 ">
                <h2 className="text-xl mb-4">Login</h2>
                <input type="email" autoComplete="email" className="w-full mb-2 p-2 border" placeholder="Email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input type="password" autoComplete="current-password" className="w-full mb-2 p-2 border" placeholder="Password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />

                <button className="w-full bg-blue-500 text-white p-2">Login</button>


                <p className="text-sm mt-4 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 underline">
                        Register here
                    </Link>
                </p>

            </form>
        </div>
    );
}