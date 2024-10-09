import { useState, useEffect } from "react";
interface IOrder {
  _id: string;
  product: {
    volume: string;
    duration: string;
  };
  phone: string;
  email?: string;
}
export default function AdminOrderList() {
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch("/api/orders");
    if (response.ok) {
      const data = await response.json();
      setOrders(data);
    }
  };

  const handleSendLink = async (orderId: string, link: string) => {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({ link }),
    });

    if (response.ok) {
      // Remove the order from the list after successful send
      setOrders(orders.filter((order) => order._id !== orderId));
      alert("لینک با موفقیت ارسال شد");
    } else {
      alert("خطا در ارسال لینک");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">لیست سفارش‌ها</h2>
      {orders.length === 0 ? (
        <p>هیچ سفارشی برای نمایش وجود ندارد.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="mb-4 p-4 border rounded">
              <p>
                محصول: {order.product.volume} - {order.product.duration}
              </p>
              <p>شماره تماس: {order.phone}</p>
              {order.email && <p>ایمیل: {order.email}</p>}
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="لینک فیلترشکن"
                  className="p-2 border rounded mr-2"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendLink(
                        order._id,
                        (e.target as HTMLInputElement).value
                      );
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const link = prompt("لینک فیلترشکن را وارد کنید:");
                    if (link) {
                      handleSendLink(order._id, link);
                    }
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  ارسال لینک
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
