// src/pages/Gallery.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Image as ImageIcon, ExternalLink } from "lucide-react";

type GalleryImage = {
  id: string;
  created_at: string;
  title: string | null;
  caption: string | null;
  image_url: string | null;     // Cloudinary URL (preferred)
  storage_path: string | null;  // Supabase Storage path (fallback)
  is_featured?: boolean | null;
};

function urlFromRow(row: GalleryImage): string {
  // Prefer Cloudinary URL if set
  if (row.image_url) return row.image_url;

  // Fallback to Supabase Storage path if present and bucket is public
  if (row.storage_path) {
    const { data } = supabase.storage.from("gallery").getPublicUrl(row.storage_path);
    return data?.publicUrl || "";
  }
  return "";
}

export default function Gallery() {
  const [list, setList] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // IMPORTANT: make sure we select image_url too
      const { data, error } = await supabase
        .from("gallery_images")
        .select("id, created_at, title, caption, image_url, storage_path, is_featured")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("gallery_images select error:", error);
      } else if (Array.isArray(data)) {
        setList(data as GalleryImage[]);
        // Debug: see what URLs we’ll render
        if (import.meta.env.DEV) {
          console.table(
            (data as GalleryImage[]).map((r) => ({
              id: r.id,
              image_url: r.image_url,
              storage_path: r.storage_path,
              final_url: urlFromRow(r),
            }))
          );
        }
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <Loader2 className="h-5 w-5 inline animate-spin mr-2" />
        Loading gallery…
      </div>
    );
  }

  if (list.length === 0) {
    return <div className="py-12 text-center text-muted-foreground">No images yet.</div>;
  }

  return (
    <section className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {list.map((img) => {
          const url = urlFromRow(img);
          const hasUrl = !!url;

          return (
            <Card key={img.id} className="overflow-hidden">
              <CardContent className="p-0">
                {hasUrl ? (
                  <>
                    <img
                      src={url}
                      alt={img.title || "Gallery image"}
                      className="w-full aspect-square object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        console.warn("Image failed to load:", { url, img });
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                        const fallback = e.currentTarget.nextElementSibling as HTMLDivElement | null;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    {/* Fallback overlay shown when img onError occurs */}
                    <div
                      className="hidden h-40 items-center justify-center text-muted-foreground"
                      style={{ display: "none" }}
                    >
                      <ImageIcon className="h-5 w-5 mr-2" />
                      Image unavailable
                    </div>
                  </>
                ) : (
                  <div className="h-40 flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Image unavailable
                  </div>
                )}
              </CardContent>

              {(img.title || img.caption || url) && (
                <div className="p-2">
                  <div className="text-sm font-medium line-clamp-1">{img.title || "Untitled"}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{img.caption || ""}</div>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      title="Open full image"
                    >
                      Open image <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
