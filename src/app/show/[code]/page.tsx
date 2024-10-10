"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ShowAccessLink() {
  const params = useParams<{ code: string }>();
  const [loading, setLoading] = useState(true);
  const [accessLink, setAccessLink] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (params.code && params.code !== "") {
        try {
          const res = await fetch(`/api/get-link/${params.code}`, {
            method: "POST",
            cache: "default",
          });
          const data = await res.json();
          if (data.link) {
            setAccessLink(data.link);
            console.log("data in fetch access link: ", data);
          } else if (!data.link && data.status === "completed") {
            setAccessLink(
              "پرداخت شما با موفقیت انجام شده است و لینک بزودی برای شما ارسال خواهد شد. لطفا صبور باشید."
            );
          }
        } catch (error) {
          console.error("Error fetching access link:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.code]);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "کپی شد!",
        description: "لینک در کلیپ‌بورد کپی شد.",
      });
    } catch (err) {
      toast({
        title: "خطا",
        description: "کپی کردن لینک با مشکل مواجه شد.",
        variant: "destructive",
      });
    }
  };

  if (!params) {
    return (
      <main className="h-screen w-full flex justify-center items-center">
        <p>نامعتبر</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="h-screen w-full flex justify-center items-center">
        <p>درحال بارگزاری...</p>
      </main>
    );
  }

  if (!accessLink) {
    return (
      <main className="h-screen w-full flex justify-center items-center">
        <p>هیج لینکی پیدا نشد.</p>
      </main>
    );
  }

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">لینک:</h1>
        <Textarea
          value={accessLink}
          readOnly
          className="p-4 text-center border border-black/15 m-2 rounded-md h-full min-h-72 min-w-[300px] md:min-w-[500px] xl:min-w-[700px]"
        />
        <Button
          size="sm"
          onClick={() => copyToClipboard(accessLink)}
          className="mt-4"
        >
          <Copy className="w-5 h-5 ml-2" />
          کپی
        </Button>
      </div>
    </main>
  );
}
