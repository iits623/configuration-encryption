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
        access: "private",
        contentType: contentType,
      },
    );

    res.status(200).json({
      success: true,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      message: "فایل با موفقیت آپلود شد",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "خطا در آپلود فایل",
    });
  }
}
