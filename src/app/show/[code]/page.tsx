"use client";
import { Button } from "@/components/ui/button";
import ShinyButton from "@/components/ui/shiny-button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Copy, Download } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerFooter,
//   DrawerTrigger,
// } from "@/components/ui/drawer";

interface VideoData {
  title: string;
  image: string;
  videoSrc: string;
  downloadLink: string;
}

const videoData: VideoData[] = [
  {
    title: "آموزش نصب Foxray در آیفون",
    image: "/images/learn/foxray.png",
    videoSrc:
      "https://firsts.s3.ir-thr-at1.arvanstorage.ir/foxray.mp4?versionId=",
    downloadLink:
      "https://firsts.s3.ir-thr-at1.arvanstorage.ir/foxray.mp4?versionId=",
  },
  {
    title: "آموزش نصب V2box در آیفون",
    image: "/images/learn/v2box.png",
    videoSrc:
      "https://firsts.s3.ir-thr-at1.arvanstorage.ir/v2box.mp4?versionId=",
    downloadLink:
      "https://firsts.s3.ir-thr-at1.arvanstorage.ir/v2box.mp4?versionId=",
  },
  {
    title: "آموزش نصب V2ray در اندروید",
    image: "/images/learn/v2ray.png",
    videoSrc:
      "https://firsts.s3.ir-thr-at1.arvanstorage.ir/v2ray.mp4?versionId=",
    downloadLink:
      "https://firsts.s3.ir-thr-at1.arvanstorage.ir/v2ray.mp4?versionId=",
  },
];

export default function ShowAccessLink() {
  const params = useParams<{ code: string }>();
  const [loading, setLoading] = useState(true);
  const [accessLink, setAccessLink] = useState("");
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

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
      console.log("کپی کردن لینک با مشکل مواجه شد. ", err);
      toast({
        title: "خطا",
        description: "کپی کردن لینک با مشکل مواجه شد.",
        variant: "destructive",
      });
    }
  };

  const openVideoDialog = (video: VideoData) => {
    setSelectedVideo(video);
    setIsDialogOpen(true);
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
      <main className="h-screen w-full flex flex-col gap-5 justify-center items-center">
        <p>هیج لینکی پیدا نشد.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          {videoData.map((video, index) => (
            <div
              key={index}
              className="flex flex-row gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all"
            >
              <div>
                <Image
                  width={250}
                  height={250}
                  className="object-cover rounded-lg w-16 h-auto"
                  src={video.image}
                  alt={video.title}
                />
              </div>
              <div
                className="flex flex-col gap-2"
                onClick={() => openVideoDialog(video)}
              >
                <p className="text-center font-bold text-sm">{video.title}</p>
                <ShinyButton>مشاهده</ShinyButton>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // نسخه Dialog
  const DialogVersion = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>{selectedVideo?.title}</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <video controls className="w-full h-96">
            <source src={selectedVideo?.videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <DialogFooter className="flex flex-row gap-4 !justify-center items-center w-full">
          <Button onClick={() => setIsDialogOpen(false)} variant={"ghost"}>
            بستن
          </Button>
          <Button>
            <a
              className="flex flex-row"
              href={selectedVideo?.downloadLink}
              target="_blank"
            >
              <Download className="ml-2 h-4 w-4" /> دانلود
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // نسخه Drawer
  // const DrawerVersion = () => (
  //   <Drawer>
  //     <DrawerTrigger asChild>
  //       <ShinyButton onClick={() => setSelectedVideo(videoData[0])}>
  //         مشاهده
  //       </ShinyButton>
  //     </DrawerTrigger>
  //     <DrawerContent>
  //       <DrawerHeader>
  //         <DrawerTitle>{selectedVideo?.title}</DrawerTitle>
  //       </DrawerHeader>
  //       <div className="w-full p-4">
  //         <video controls className="w-full">
  //           <source src={selectedVideo?.videoSrc} type="video/mp4" />
  //           Your browser does not support the video tag.
  //         </video>
  //       </div>
  //       <DrawerFooter>
  //         <Button asChild>
  //           <a href={selectedVideo?.downloadLink} download>
  //             <Download className="mr-2 h-4 w-4" /> دانلود
  //           </a>
  //         </Button>
  //       </DrawerFooter>
  //     </DrawerContent>
  //   </Drawer>
  // );

  return (
    <main className="h-screen w-full flex flex-col justify-center items-center gap-10 mb-16 md:mb-0">
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
      <div className="mx-4 md:mx-0 md:w-[45rem] bg-yellow-100 border-r-4 border-yellow-500 p-4 rounded-lg">
        <p className="text-sm text-yellow-700 flex items-center justify-end">
          <AlertCircle className="h-8 w-8 ml-2 text-yellow-500" />
          حتما تمام تنظیمات مشخص شده در هر اپلیکیشن رو به درستی وارد کنید. مثل
          allowinsecure و transport و gRpc در هر بخش مشخص شده رو به درستی وارد
          کنید.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-3">
        {videoData.map((video, index) => (
          <div
            key={index}
            className="flex flex-row gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all"
          >
            <div>
              <Image
                width={250}
                height={250}
                className="object-cover rounded-lg w-16 h-auto"
                src={video.image}
                alt={video.title}
              />
            </div>
            <div
              className="flex flex-col gap-2"
              onClick={() => openVideoDialog(video)}
            >
              <p className="text-center font-bold text-sm">{video.title}</p>
              <ShinyButton>مشاهده</ShinyButton>
            </div>
          </div>
        ))}
      </div>

      {/* نسخه Dialog */}
      <DialogVersion />

      {/* نسخه Drawer */}
      {/* <DrawerVersion /> */}
    </main>
  );
}
