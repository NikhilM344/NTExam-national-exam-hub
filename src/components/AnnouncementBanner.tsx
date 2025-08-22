// src/components/AnnouncementBanner.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Megaphone } from "lucide-react";

type Announcement = { id: string; title: string; body: string; published_at?: string | null };

export default function AnnouncementBanner() {
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("id,title,body,published_at")
        .order("published_at", { ascending: false })
        .limit(3);
      if (!error && data) setItems(data);
    })();
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 space-y-2">
      <div className="flex items-center gap-2 font-semibold">
        <Megaphone className="h-4 w-4 text-warning" />
        Latest Announcements
      </div>
      <ul className="text-sm list-disc pl-5 space-y-1">
        {items.map((a) => (
          <li key={a.id}>
            <span className="font-medium">{a.title}: </span>
            <span>{a.body}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
