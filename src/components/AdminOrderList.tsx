import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface IOrder {
  _id: string;
  product: {
    volume: string;
    duration: string;
  };
  phone: string;
  email?: string;
}

const AdminOrderList: React.FC = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
      // Initialize links state with empty strings for each order
      const initialLinks = data.reduce(
        (acc: { [key: string]: string }, order: IOrder) => {
          acc[order._id] = "";
          return acc;
        },
        {}
      );
      setLinks(initialLinks);
    } catch (err) {
      setError("Error fetching orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkChange = (orderId: string, value: string) => {
    setLinks((prevLinks) => ({
      ...prevLinks,
      [orderId]: value,
    }));
  };

  const handleSendLink = async (orderId: string) => {
    const link = links[orderId];
    if (!link) {
      alert("لطفا لینک فیلترشکن را وارد کنید");
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link }),
      });

      if (!response.ok) {
        throw new Error("Failed to send link");
      }

      setOrders(orders.filter((order) => order._id !== orderId));
      setLinks((prevLinks) => {
        const newLinks = { ...prevLinks };
        delete newLinks[orderId];
        return newLinks;
      });
      alert("لینک با موفقیت ارسال شد");
    } catch (err) {
      alert("خطا در ارسال لینک");
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">درحال بارگذاری لیست سفارشات...</div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "کپی شد!",
        description: "لینک در کلیپ‌بورد کپی شد.",
      });
    } catch (err) {
      console.log("کپی کردن لینک با مشکل مواجه شد. ", err);
      toast({
        title: "خطا",
        description: "کپی کردن لینک با مشکل مواجه شد.",
        variant: "destructive",
      });
    }
  };
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">لیست سفارش‌ها</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-center">هیچ سفارشی برای نمایش وجود ندارد.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id}>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="font-semibold">محصول:</p>
                        <p
                          onClick={() =>
                            copyToClipboard(
                              `لینک ${order?.product?.volume} بصورت${" "}${
                                order?.product?.duration
                              } برام بفرستید.`
                            )
                          }
                        >
                          لینک {order?.product?.volume} بصورت{" "}
                          {order?.product?.duration} برام بفرستید.
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">شماره تماس:</p>
                        <p>{order.phone}</p>
                      </div>
                      {order.email && (
                        <div className="col-span-1 md:col-span-2">
                          <p className="font-semibold">ایمیل:</p>
                          <p>{order.email}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <Input
                        type="text"
                        placeholder="لینک فیلترشکن"
                        value={links[order._id]}
                        onChange={(e) =>
                          handleLinkChange(order._id, e.target.value)
                        }
                        className="w-full"
                      />
                      <Button
                        onClick={() => handleSendLink(order._id)}
                        className="w-full"
                      >
                        ارسال لینک
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrderList;
