import React, { useState, useEffect } from "react";
import { Product } from "@/lib/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";
import { RainbowButton } from "./ui/rainbow-button";
import { cn } from "@/lib/utils";

interface OrderFormProps {
  product: Product;
  onSubmit: (orderData: {
    product: Product;
    phone: string;
    email?: string;
  }) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ product, onSubmit }) => {
  const [phone, setPhone] = useState("");
  const [confirmPhone, setConfirmPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPhoneMatching, setIsPhoneMatching] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const phoneRegex = /^09\d{9}$/;
    setIsPhoneValid(phoneRegex.test(phone));
    setIsPhoneMatching(phone === confirmPhone && phone !== "");
  }, [phone, confirmPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhoneValid && isPhoneMatching) {
      setLoading(true);
      onSubmit({ product, phone, email });
      setTimeout(() => setLoading(false), 3000);
    }
  };

  return (
    <Card className="mt-8 max-w-md mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">
          تکمیل سفارش
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-right block font-semibold">
              شماره موبایل (اجباری)
            </Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className={cn(
                "w-full text-right transition-colors",
                isPhoneValid ? "border-green-500" : "border-red-500"
              )}
              dir="rtl"
              placeholder="09123456789"
            />
            {!isPhoneValid && phone && (
              <p className="text-sm text-red-500 flex items-center justify-end mt-1">
                <AlertCircle className="h-4 w-4 ml-1" />
                شماره موبایل باید با 09 شروع شود و 11 رقم باشد
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="confirmPhone"
              className="text-right block font-semibold"
            >
              تأیید شماره موبایل
            </Label>
            <Input
              type="tel"
              id="confirmPhone"
              value={confirmPhone}
              onChange={(e) => setConfirmPhone(e.target.value)}
              required
              className={cn(
                "w-full text-right transition-colors",
                isPhoneMatching ? "border-green-500" : "border-red-500"
              )}
              dir="rtl"
              placeholder="09123456789"
            />
            {!isPhoneMatching && confirmPhone && (
              <p className="text-sm text-red-500 flex items-center justify-end mt-1">
                <AlertCircle className="h-4 w-4 ml-1" />
                شماره‌های وارد شده مطابقت ندارند
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-right block font-semibold">
              ایمیل (اختیاری)
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-right"
              dir="rtl"
              placeholder="example@example.com"
            />
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
            <h3 className="font-semibold text-lg mb-2 text-right text-gray-800">
              جزئیات سفارش:
            </h3>
            <p className="text-right text-gray-700">
              {product.volume} - {product.duration}
            </p>
            <p className="text-right font-bold text-xl mt-2 text-blue-600">
              قیمت: {product.price.toLocaleString()} تومان
            </p>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">
            <p className="text-sm text-yellow-700 flex items-center justify-end">
              <AlertCircle className="h-5 w-5 ml-2 text-yellow-500" />
              در صورت اشتباه وارد کردن شماره موبایل، لینک برای شما ارسال نخواهد
              شد و هزینه‌ای برگشت داده نمی‌شود.
            </p>
          </div>
          <RainbowButton
            type="submit"
            className="w-full py-3 text-lg font-semibold"
            disabled={!isPhoneValid || !isPhoneMatching || loading}
          >
            {loading ? (
              <Loader className="animate-spin ml-2 h-5 w-5" />
            ) : isPhoneValid && isPhoneMatching ? (
              <>
                <CheckCircle2 className="ml-2 h-5 w-5" />
                ورود به صفحه پرداخت
              </>
            ) : (
              "لطفاً اطلاعات را کامل کنید"
            )}
          </RainbowButton>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
