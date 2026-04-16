import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import StarCard from "../components/StarCard";

export default function AdminDashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await API.get("/tasks");
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                toast.error("Failed to load tasks");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter tasks based on search
    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteTask = async (taskId) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            await API.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter((task) => task._id !== taskId));
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    };

    // Stats
    const stats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.completed).length,
        pending: tasks.filter((t) => !t.completed).length,
        users: new Set(tasks.map((t) => t.user?._id)).size
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-slate-200 rounded-lg w-48"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl shadow-xl animate-pulse">
                                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 sm:p-8 lg:p-12">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-600 text-lg">Manage all tasks and users</p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search tasks or users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <StarCard stats={stats} />

                {/* Tasks Grid */}
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredTasks.map((task) => (
                        <div
                            key={task._id}
                            className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-2 hover:bg-white transition-all duration-300 flex flex-col"
                        >
                            {/* Task Title & Status */}
                            <div className="flex-1 mb-4">
                                <h3
                                    className={`text-xl font-semibold leading-relaxed mb-3 transition-all duration-200 ${task.completed
                                            ? "line-through text-gray-400"
                                            : "text-gray-800 hover:text-gray-900"
                                        }`}
                                >
                                    {task.title}
                                </h3>

                                <div className="flex items-center justify-between mb-2">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${task.completed
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                        {task.completed ? '✓ Completed' : '⏳ Pending'}
                                    </span>
                                    {task.dueDate && (
                                        <span className="text-xs text-gray-500">
                                            Due {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                        {task.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {task.user?.email || "Unknown User"}
                                        </p>
                                        <p className="text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => deleteTask(task._id)}
                                className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Task
                            </button>
                        </div>
                    ))}
                </div>

                {filteredTasks.length === 0 && (
                    <div className="text-center py-20 col-span-full">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                            {searchTerm ? "No matching tasks" : "No tasks found"}
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {searchTerm
                                ? "Try adjusting your search terms"
                                : "Get started by creating your first task"
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}