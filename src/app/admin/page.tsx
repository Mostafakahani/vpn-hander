"use client";

import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import AdminOrderList from "../../components/AdminOrderList";

const AdminPage: React.FC = () => {
  // const { data: session, status } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     // این تابع زمانی فراخوانی می‌شود که کاربر احراز هویت نشده باشد
  //     // می‌توانید کاربر را به صفحه ورود هدایت کنید
  //   },
  // });
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (session) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">پنل مدیریت</h1>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded mb-4"
        >
          خروج
        </button>
        <AdminOrderList />
      </div>
    );
  }
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", { username, password });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ورود به پنل مدیریت</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1">
            نام کاربری
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">
            رمز عبور
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ورود
        </button>
      </form>
    </div>
  );
};

export default AdminPage;
