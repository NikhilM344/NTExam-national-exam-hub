// utils/cloudinary.ts
export async function uploadToCloudinary(file: File) {
  const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
  const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
  const FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER as string | undefined;

  const url = `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", PRESET);
  if (FOLDER) fd.append("folder", FOLDER);

  const res = await fetch(url, { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "Cloudinary upload failed");

  // Useful fields: json.secure_url, json.public_id, json.width, json.height
  return json as { secure_url: string; public_id: string };
}
