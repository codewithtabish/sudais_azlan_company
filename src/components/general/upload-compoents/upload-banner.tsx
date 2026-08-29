"use client";

import { uploadBannerAction } from "@/app/actions/images/upload-banner-image";
import { CheckCircle2, Copy, ImageIcon, Loader2, RefreshCw, Upload, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type UploadState = "idle" | "uploading" | "success" | "error";

export default function BannerImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Revoke local object URLs when component changes/unmounts.
   */
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /**
   * Open native file picker.
   */
  const openFilePicker = () => {
    if (uploadState === "uploading") return;

    inputRef.current?.click();
  };

  /**
   * Handle selected file.
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    void uploadFile(file);

    // Allow selecting the same file again.
    event.target.value = "";
  };

  /**
   * Validate and upload image.
   */
  const uploadFile = async (file: File) => {
    // ---------------------------------------------------------
    // Client-side validation
    // ---------------------------------------------------------

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", {
        description: "Please select a valid image file.",
      });

      setUploadState("error");
      return;
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (file.size === 0) {
      toast.error("Empty image", {
        description: "The selected image contains no data.",
      });

      setUploadState("error");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image is too large", {
        description: "The banner image must be smaller than 10 MB.",
      });

      setUploadState("error");
      return;
    }

    // ---------------------------------------------------------
    // Create local preview immediately
    // ---------------------------------------------------------

    const localPreview = URL.createObjectURL(file);

    setPreviewUrl((previous) => {
      if (previous?.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }

      return localPreview;
    });

    setUploadedUrl(null);
    setUploadedKey(null);
    setUploadState("uploading");

    // ---------------------------------------------------------
    // Prepare FormData
    // ---------------------------------------------------------

    const formData = new FormData();
    formData.append("file", file);

    try {
      // -------------------------------------------------------
      // Call server action
      // -------------------------------------------------------

      const result = await uploadBannerAction(formData);

      // -------------------------------------------------------
      // Server action failed
      // -------------------------------------------------------

      if (!result.success) {
        setUploadState("error");

        toast.error("Upload failed", {
          description: result.error || "Failed to upload banner image.",
        });

        return;
      }

      // -------------------------------------------------------
      // Upload successful
      // -------------------------------------------------------

      setUploadedUrl(result.data.url);
      setUploadedKey(result.data.key);
      setUploadState("success");

      toast.success("Banner uploaded successfully", {
        description: "Your banner image is now available through CloudFront.",
      });
    } catch (error) {
      console.error("Banner upload error:", error);

      setUploadState("error");

      toast.error("Upload failed", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while uploading the banner.",
      });
    }
  };

  /**
   * Drag & drop.
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragging(false);

    if (uploadState === "uploading") return;

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    void uploadFile(file);
  };

  /**
   * Copy CloudFront URL.
   */
  const copyUrl = async () => {
    if (!uploadedUrl) return;

    try {
      await navigator.clipboard.writeText(uploadedUrl);

      toast.success("URL copied", {
        description: "The CloudFront image URL has been copied.",
      });
    } catch {
      toast.error("Could not copy URL", {
        description: "Please copy the URL manually.",
      });
    }
  };

  /**
   * Remove current image.
   */
  const clearImage = () => {
    if (uploadState === "uploading") return;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setUploadedUrl(null);
    setUploadedKey(null);
    setUploadState("idle");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  /**
   * Replace image.
   */
  const replaceImage = () => {
    if (uploadState === "uploading") return;

    inputRef.current?.click();
  };

  return (
    <section className="w-full">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* --------------------------------------------------- */}
        {/* Header */}
        {/* --------------------------------------------------- */}

        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">Banner image</h2>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Upload a banner image. It will be processed to 1600 × 900 WebP and served through
              CloudFront.
            </p>
          </div>

          {uploadState === "success" && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              Uploaded
            </div>
          )}
        </div>

        <div className="p-5">
          {/* ------------------------------------------------- */}
          {/* Hidden input */}
          {/* ------------------------------------------------- */}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/tiff"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploadState === "uploading"}
          />

          {/* ------------------------------------------------- */}
          {/* Empty state */}
          {/* ------------------------------------------------- */}

          {!previewUrl && (
            <div
              role="button"
              tabIndex={0}
              onClick={openFilePicker}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openFilePicker();
                }
              }}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              className={[
                "group flex min-h-72 cursor-pointer flex-col items-center justify-center",
                "rounded-xl border border-dashed px-6 py-10 text-center",
                "transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40",
              ].join(" ")}
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Upload className="size-5 text-muted-foreground group-hover:text-primary" />
              </div>

              <p className="text-sm font-medium text-foreground">Drop your banner here</p>

              <p className="mt-1.5 text-xs text-muted-foreground">
                or click to browse from your computer
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
                <span className="rounded-md border border-border bg-background px-2 py-1">
                  JPEG
                </span>

                <span className="rounded-md border border-border bg-background px-2 py-1">PNG</span>

                <span className="rounded-md border border-border bg-background px-2 py-1">
                  WebP
                </span>

                <span className="rounded-md border border-border bg-background px-2 py-1">
                  Max 10 MB
                </span>
              </div>
            </div>
          )}

          {/* ------------------------------------------------- */}
          {/* Preview */}
          {/* ------------------------------------------------- */}

          {previewUrl && (
            <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
              {/* Image */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <Image
                  src={previewUrl}
                  alt="Banner preview"
                  fill
                  unoptimized
                  className={[
                    "object-cover transition-all duration-300",
                    uploadState === "uploading" ? "scale-[1.01] blur-[1px]" : "",
                  ].join(" ")}
                  sizes="(max-width: 768px) 100vw, 800px"
                />

                {/* Upload overlay */}
                {uploadState === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-black/60 px-6 py-5 text-center shadow-xl">
                      <Loader2 className="size-6 animate-spin text-white" />

                      <div>
                        <p className="text-sm font-medium text-white">Uploading banner...</p>

                        <p className="mt-1 text-xs text-white/70">
                          Processing and uploading to AWS
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error overlay */}
                {uploadState === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <div className="rounded-lg border border-red-400/20 bg-background/95 px-5 py-4 text-center shadow-xl">
                      <p className="text-sm font-medium text-foreground">Upload failed</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Try uploading the image again.
                      </p>
                    </div>
                  </div>
                )}

                {/* Image label */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/60 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-md">
                  <ImageIcon className="size-3.5" />
                  1600 × 900
                </div>

                {/* Clear button */}
                {uploadState !== "uploading" && (
                  <button
                    type="button"
                    onClick={clearImage}
                    aria-label="Remove banner image"
                    className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-md border border-white/10 bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/80"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* ------------------------------------------------ */}
              {/* Image information */}
              {/* ------------------------------------------------ */}

              <div className="space-y-4 border-t border-border p-4">
                {/* Status */}
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground">
                      {uploadState === "uploading"
                        ? "Processing image"
                        : uploadState === "success"
                          ? "Upload complete"
                          : "Upload failed"}
                    </p>

                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {uploadState === "uploading"
                        ? "Please wait while the image is optimized."
                        : uploadState === "success"
                          ? "Optimized WebP image is ready."
                          : "You can replace the image and try again."}
                    </p>
                  </div>

                  {uploadState !== "uploading" && (
                    <button
                      type="button"
                      onClick={replaceImage}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      <RefreshCw className="size-3.5" />
                      Replace
                    </button>
                  )}
                </div>

                {/* CloudFront URL */}
                {uploadedUrl && uploadState === "success" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="banner-cloudfront-url"
                      className="text-[11px] font-medium text-muted-foreground"
                    >
                      CloudFront URL
                    </label>

                    <div className="flex min-w-0 items-center gap-2">
                      <input
                        id="banner-cloudfront-url"
                        value={uploadedUrl}
                        readOnly
                        className="h-9 min-w-0 flex-1 rounded-md border border-border bg-muted/30 px-3 text-xs text-foreground outline-none"
                      />

                      <button
                        type="button"
                        onClick={copyUrl}
                        aria-label="Copy CloudFront URL"
                        className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Copy className="size-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* S3 key */}
                {uploadedKey && uploadState === "success" && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-muted-foreground">Storage key</p>

                    <p className="break-all rounded-md bg-muted/50 px-3 py-2 font-mono text-[10px] leading-4 text-muted-foreground">
                      {uploadedKey}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------- */}
          {/* Footer information */}
          {/* ------------------------------------------------- */}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span>Images are automatically converted to WebP.</span>

            <span>1600 × 900 · 16:9</span>
          </div>
        </div>
      </div>
    </section>
  );
}
