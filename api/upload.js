import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const contentType =
      req.headers["content-type"] || "application/octet-stream";

    const blob = await put(
      `uploads/${Date.now()}_${Math.random().toString(36).substring(7)}`,
      buffer,
      {
        access: "public",
        contentType: contentType,
      },
    );

    res.status(200).json({
      success: true,
      url: blob.url,
      message: "فایل با موفقیت آپلود شد",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "خطا در آپلود فایل",
    });
  }
}
