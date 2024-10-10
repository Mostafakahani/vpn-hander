"use client";
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AdminOrderList from "@/components/AdminOrderList";

const AdminPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", { username, password });
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (session) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-bold">پنل مدیریت</CardTitle>
            <Button
              onClick={() => signOut()}
              variant="destructive"
              className="mb-4"
            >
              خروج
            </Button>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <AdminOrderList />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            ورود به پنل مدیریت
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">نام کاربری</Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              ورود
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
