import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({
        title: "",
        completed: false
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const { logout } = useContext(AuthContext);

    const fetchTasks = async () => {
        try {
            const { data } = await API.get("/tasks");
            setTasks(data);
        } catch {
            toast.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSubmit = async () => {
        try {
            if (!form.title.trim()) {
                return toast.error("Task cannot be empty");
            }

            if (editId) {
                await API.put(`/tasks/${editId}`, form);
                toast.success("Task updated");
                setEditId(null);
            } else {
                await API.post("/tasks", form);
                toast.success("Task added");
            }

            setForm({ title: "", completed: false });
            fetchTasks();
        } catch {
            toast.error("Action failed");
        }
    };

    const deleteTask = async (id) => {
        try {
            await API.delete(`/tasks/${id}`);
            toast.success("Deleted");
            fetchTasks();
        } catch {
            toast.error("Delete failed");
        }
    };

    const editTask = (task) => {
        setForm({
            title: task.title,
            completed: task.completed
        });
        setEditId(task._id);
    };

    if (loading) {
        return <p className="p-6">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </div>

            {/* Input Card */}
            <div className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-3">

                <input
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                    className="border p-2 rounded"
                    placeholder="Enter task..."
                />

                {editId && (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={form.completed}
                            onChange={(e) =>
                                setForm({ ...form, completed: e.target.checked })
                            }
                        />
                        Mark as Completed
                    </label>
                )}

                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {editId ? "Update" : "Add"}
                </button>
            </div>

            {/* Empty state */}
            {tasks.length === 0 && (
                <p className="text-gray-500">No tasks yet</p>
            )}

            {/* Task Cards */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 hover:bg-white transition-all duration-300 flex flex-col sm:flex-row sm:justify-between sm:items-start "
                    >
                        {/* Task Content */}
                        <div className="flex-1 mb-4 sm:mb-0 sm:pr-4">
                            <h3
                                className={`text-xl font-semibold leading-relaxed mb-2 transition-all duration-200 ${task.completed
                                        ? "line-through text-gray-400"
                                        : "text-gray-800 hover:text-gray-900"
                                    }`}
                            >
                                {task.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-2">
                                {task.completed ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full shadow-sm">
                                        ✓ Completed
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full shadow-sm">
                                        ⏳ Pending
                                    </span>
                                )}

                                {task.dueDate && (
                                    <span className="text-xs text-gray-500">
                                        Due {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons - Always visible on mobile, hover on desktop */}
                        <div className="flex items-center gap-2 w-full sm:w-auto sm:opacity-0 sm:group-hover:opacity-100 sm:transition-all sm:duration-200 sm:ml-4">
                            <button
                                onClick={() => editTask(task)}
                                className="flex items-center justify-center gap-1.5 flex-1 sm:flex-none px-3 py-2.5 sm:px-4 bg-linear-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                title="Edit task"
                            >
                                <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span className="hidden sm:inline">Edit</span>
                            </button>

                            <button
                                onClick={() => deleteTask(task._id)}
                                className="flex items-center justify-center gap-1.5 flex-1 sm:flex-none px-3 py-2.5 sm:px-4 bg-linear-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                title="Delete task"
                            >
                                <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="hidden sm:inline">Delete</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>




        </div>
    );
}