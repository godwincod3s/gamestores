// app/(routes)/account/downloads/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconDownload } from "@tabler/icons-react";

type Download = {
  id: string;
  name: string;
  file_url: string;
  product_name: string;
  downloaded_count?: number;
};

export default function DownloadsPage() {
  const router = useRouter();
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDownloads() {
      try {
        const res = await fetch("/api/account/downloads");
        if (!res.ok) {
          if (res.status === 401) router.push("/account/login");
          setError("Failed to load downloads");
          return;
        }
        const data = await res.json();
        setDownloads(data.downloads || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDownloads();
  }, [router]);

  if (loading) return <div>Loading downloads...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Downloads</h1>
      {downloads.length === 0 ? (
        <p className="text-gray-600">You don't have any downloads available yet.</p>
      ) : (
        <div className="space-y-4">
          {downloads.map((download) => (
            <div key={download.id} className="bg-white border rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition">
              <div>
                <p className="font-bold">{download.product_name}</p>
                <p className="text-sm text-gray-600">{download.name}</p>
              </div>
              <a
                href={download.file_url}
                download
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <IconDownload className="w-4 h-4" />
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}