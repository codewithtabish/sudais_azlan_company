"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Loader2, Upload, X, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { uploadOgAction } from "@/app/actions/images/upload-og-image-action";

type UploadedOg = {
  url: string;
  key: string;
  width: number;
  height: number;
  format: string;
};

export default function OgImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedOg, setUploadedOg] = useState<UploadedOg | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // -------------------------------------------------------
    // Reset previous upload
    // -------------------------------------------------------

    setUploadedOg(null);

    // -------------------------------------------------------
    // Client-side validation
    // -------------------------------------------------------

    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
      "image/tiff",
    ]);

    const maxFileSize = 10 * 1024 * 1024;

    if (!allowedTypes.has(file.type)) {
      toast.error("Unsupported image type. Please upload JPEG, PNG, WebP, GIF, AVIF, or TIFF.");

      event.target.value = "";
      return;
    }

    if (file.size === 0) {
      toast.error("The selected OG image is empty.");

      event.target.value = "";
      return;
    }

    if (file.size > maxFileSize) {
      toast.error("OG image must be smaller than 10 MB.");

      event.target.value = "";
      return;
    }

    // -------------------------------------------------------
    // Local preview
    // -------------------------------------------------------

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return objectUrl;
    });

    // -------------------------------------------------------
    // Upload
    // -------------------------------------------------------

    setIsUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const result = await uploadOgAction(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setUploadedOg(result.data);

      // Use the optimized CloudFront image returned by S3 upload.
      setPreviewUrl(result.data.url);

      toast.success("OG image uploaded successfully.");
    } catch (error) {
      console.error("OG image upload failed:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to upload OG image. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  // -------------------------------------------------------
  // Remove image
  // -------------------------------------------------------

  const handleRemove = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setUploadedOg(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // -------------------------------------------------------
  // Copy URL
  // -------------------------------------------------------

  const handleCopyUrl = async () => {
    if (!uploadedOg?.url) return;

    try {
      await navigator.clipboard.writeText(uploadedOg.url);

      toast.success("OG image URL copied.");
    } catch {
      toast.error("Could not copy the image URL.");
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* =====================================================
          UPLOAD AREA
          ===================================================== */}

      <div className="space-y-2">
        <div>
          <h2 className="text-sm font-semibold text-foreground">OG Image</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Upload the Open Graph image used when your project is shared on social platforms.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/tiff"
          onChange={handleFileChange}
          disabled={isUploading}
          className="sr-only"
        />

        {!previewUrl ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="group flex min-h-56 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
              <Upload className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
            </span>

            <span className="text-sm font-medium text-foreground">Click to upload OG image</span>

            <span className="mt-1 text-xs text-muted-foreground">
              JPEG, PNG, WebP, GIF, AVIF or TIFF · Max 10 MB
            </span>
          </button>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
            {/* =================================================
                IMAGE PREVIEW
                ================================================= */}

            <div className="relative aspect-[1200/630] w-full overflow-hidden bg-muted">
              <Image
                src={previewUrl}
                alt="OG image preview"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />

              {/* Upload overlay */}

              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background/95 px-6 py-5 shadow-lg">
                    <Loader2 className="size-6 animate-spin text-primary" />

                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Uploading OG image</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Processing and optimizing image...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Remove button */}

              {!isUploading && (
                <button
                  type="button"
                  onClick={handleRemove}
                  aria-label="Remove OG image"
                  className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-lg border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* =================================================
                UPLOAD INFORMATION
                ================================================= */}

            <div className="space-y-3 border-t border-border p-4">
              {uploadedOg ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-500" />

                    <span className="text-sm font-medium text-foreground">Upload complete</span>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      CloudFront URL
                    </p>

                    <div className="flex items-center gap-2">
                      <p className="min-w-0 flex-1 break-all text-xs leading-5 text-foreground">
                        {uploadedOg.url}
                      </p>

                      <button
                        type="button"
                        onClick={handleCopyUrl}
                        aria-label="Copy OG image URL"
                        className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Copy className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Width
                      </p>

                      <p className="mt-1 text-xs font-medium">{uploadedOg.width}px</p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Height
                      </p>

                      <p className="mt-1 text-xs font-medium">{uploadedOg.height}px</p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Format
                      </p>

                      <p className="mt-1 text-xs font-medium uppercase">{uploadedOg.format}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Replace OG image
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {isUploading ? "Uploading..." : "Image selected"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {isUploading ? "Please wait while the image is processed." : "Preview ready."}
                    </p>
                  </div>

                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Replace
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
