"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ShowAccessLink() {
  const [loading, setLoading] = useState(true);
  const [accessLink, setAccessLink] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/get-link/${params.code}`, {
        method: "POST",
        cache: "default",
      });
      const data = await res.json();
      if (data.link) {
        setAccessLink(data.link);
        console.log("data in fetch access link: ", data);
      }
      setLoading(false);
    };
    if (params.code && params.code !== "") fetchData();
  }, []);
  const params = useParams<{ code: string }>();
  if (!params) return <>نامعتبر</>;
  if (loading || (!loading && !accessLink)) {
    if (!loading && !accessLink) {
      return <p>هیج لینکی پیدا نشد.</p>;
    } else {
      return <p>Loading...</p>;
    }
  }
  return <div>ShowAccessLink: {accessLink || null}</div>;
}
