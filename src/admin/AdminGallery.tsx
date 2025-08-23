import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Image as ImageIcon, Trash2, UploadCloud, Star, StarOff, RefreshCcw } from "lucide-react";
import { uploadToCloudinary } from "@/utils/cloudinary";


type GalleryImage = {
  id: string;
  created_at: string;
  title: string | null;
  caption: string | null;
  storage_path: string | null;     // now nullable
  image_url: string | null;        // new
  created_by_email: string | null;
  is_featured?: boolean | null;
};

/** ⬇️ SET THESE FROM YOUR CLOUDINARY ACCOUNT */
const CLOUD_NAME = "dstnofwqu";
const UPLOAD_PRESET = "ntexam_unsigned"; // make an unsigned preset in Cloudinary

export default function AdminGallery() {
  const { toast } = useToast();

  const admin = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("adminSession") || "{}"); } catch { return {}; }
  }, []);

  const [list, setList] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setList((data || []) as GalleryImage[]);
    } catch (e: any) {
      toast({ title: "Failed to load gallery", description: e?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Supabase Storage fallback (only used to derive public URL when storage_path exists)
  const publicUrl = (path: string) =>
    supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl || "";

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

const onUpload = async () => {
  if (!file) return;
  try {
    // 1) Upload to Cloudinary
    const { secure_url, public_id } = await uploadToCloudinary(file);

    // 2) Save row in DB (store secure_url)
    const payload = {
      title: title || null,
      caption: caption || null,
      image_url: secure_url,        // <— use this in the Gallery page
      cloud_public_id: public_id,   // (add this column for future deletes)
      created_by_email: admin?.email || null,
    };
    const { error } = await supabase.from("gallery_images").insert([payload]);
    if (error) throw error;

    toast({ title: "Image uploaded" });
    setFile(null); setTitle(""); setCaption(""); setPreviewUrl(null);
    inputRef.current && (inputRef.current.value = "");
    load();
  } catch (e: any) {
    toast({ title: "Upload failed", description: e?.message, variant: "destructive" });
  }
};
  const onDelete = async (row: GalleryImage) => {
    try {
      // If you want to also delete from Cloudinary, store public_id and call its destroy API.
      // Here we just remove the DB row (and storage file if it exists).
      if (row.storage_path) {
        await supabase.storage.from("gallery").remove([row.storage_path]);
      }
      const { error } = await supabase.from("gallery_images").delete().eq("id", row.id);
      if (error) throw error;
      toast({ title: "Deleted" });
      setList((prev) => prev.filter((x) => x.id !== row.id));
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.message, variant: "destructive" });
    }
  };

  const toggleFeatured = async (row: GalleryImage) => {
    try {
      const { error } = await supabase
        .from("gallery_images")
        .update({ is_featured: !row.is_featured })
        .eq("id", row.id);
      if (error) throw error;
      setList(prev => prev.map(x => x.id === row.id ? { ...x, is_featured: !row.is_featured } : x));
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message, variant: "destructive" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gallery Manager</h1>
          <p className="text-muted-foreground">Signed in as <b>{admin?.email || "admin"}</b></p>
        </div>
        <Button variant="outline" onClick={load}>
          <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <Input ref={inputRef} type="file" accept="image/*" onChange={onPickFile} />
            <Input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
          {previewUrl ? (
            <div className="flex items-center gap-3">
              <img src={previewUrl} className="h-28 rounded-md border" />
              <Button onClick={onUpload}><UploadCloud className="h-4 w-4 mr-2" /> Upload</Button>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Choose an image to see preview…</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-muted-foreground">
              <Loader2 className="h-5 w-5 inline animate-spin mr-2" />
              Loading…
            </div>
          ) : list.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">No images yet.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {list.map((img) => {
                const url = img.image_url || (img.storage_path ? publicUrl(img.storage_path) : "");
                return (
                  <div key={img.id} className="rounded-md border overflow-hidden bg-card">
                    <button onClick={() => setModalUrl(url)} className="w-full">
                      {url ? (
                        <img src={url} className="aspect-square object-cover w-full" loading="lazy" />
                      ) : (
                        <div className="aspect-square grid place-items-center text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                      )}
                    </button>
                    <div className="p-2 space-y-1">
                      <div className="text-sm font-medium line-clamp-1">{img.title || "Untitled"}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{img.caption || ""}</div>
                      <div className="flex items-center justify-between pt-2">
                        <Button size="sm" variant="outline" onClick={() => toggleFeatured(img)}>
                          {img.is_featured ? <Star className="h-4 w-4 mr-1" /> : <StarOff className="h-4 w-4 mr-1" />}
                          {img.is_featured ? "Featured" : "Feature"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onDelete(img)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!modalUrl} onOpenChange={(o) => !o && setModalUrl(null)}>
        <DialogContent className="max-w-4xl">
          {modalUrl ? <img src={modalUrl} className="w-full h-auto rounded-md" /> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
