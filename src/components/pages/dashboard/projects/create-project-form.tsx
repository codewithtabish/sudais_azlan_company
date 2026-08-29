"use client";

import {
  Calendar,
  Eye,
  GitCommit,
  ImageIcon,
  Link as LinkIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProjectEditor from "./project-editor";
import { ProjectPreviewContent } from "./project-previewer";
import { createProjectCategorySlug } from "@/lib/slug";
import { createProjectAction } from "@/app/actions/project/project-creation-action";
import {
  getAllProjectCategoriesAction,
  ProjectCategoryListItem,
} from "@/app/actions/project/get-all-category-action";
import { uploadOgAction } from "@/app/actions/images/upload-og-image-action";
import { uploadBannerAction } from "@/app/actions/images/upload-banner-image";

// ============================================================
// TYPES
// ============================================================

type ProjectContent = {
  time?: number;
  blocks: any[];
  version?: string;
  [key: string]: unknown;
};

type TechnologyItem = {
  id: string;
  name: string;
};

// ============================================================
// CONSTANTS
// ============================================================

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/tiff",
];

const PROJECT_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// ============================================================
// HELPERS
// ============================================================

function createTechnologyId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

// ============================================================
// COMPONENT
// ============================================================

export default function CreateProjectForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  // ==========================================================
  // BASIC INFO
  // ==========================================================

  const [title, setTitle] = useState("");

  const [shortDescription, setShortDescription] = useState("");

  const [slug, setSlug] = useState("");

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // ==========================================================
  // CONTENT
  // ==========================================================

  const [content, setContent] = useState<ProjectContent>({
    blocks: [],
  });

  // ==========================================================
  // CATEGORY
  // ==========================================================

  const [categories, setCategories] = useState<ProjectCategoryListItem[]>([]);

  const [categoryId, setCategoryId] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);

  // ==========================================================
  // IMAGES
  // ==========================================================

  const [bannerImage, setBannerImage] = useState("");

  const [bannerPreview, setBannerPreview] = useState("");

  const [ogImage, setOgImage] = useState("");

  const [ogPreview, setOgPreview] = useState("");

  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [uploadingOg, setUploadingOg] = useState(false);

  const bannerFormRef = useRef<HTMLFormElement>(null);

  const ogFormRef = useRef<HTMLFormElement>(null);

  // ==========================================================
  // URLS
  // ==========================================================

  const [liveUrl, setLiveUrl] = useState("");

  const [githubUrl, setGithubUrl] = useState("");

  const [demoUrl, setDemoUrl] = useState("");

  const [caseStudyUrl, setCaseStudyUrl] = useState("");

  // ==========================================================
  // TECHNOLOGIES
  // ==========================================================

  const [technologies, setTechnologies] = useState<TechnologyItem[]>([]);

  // ==========================================================
  // STATUS
  // ==========================================================

  const [featured, setFeatured] = useState(false);

  const [published, setPublished] = useState(false);

  // ==========================================================
  // SORT / DATES
  // ==========================================================

  const [sortOrder, setSortOrder] = useState("0");

  const [startedAt, setStartedAt] = useState("");

  const [completedAt, setCompletedAt] = useState("");

  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setLoadingCategories(true);

      try {
        const result = await getAllProjectCategoriesAction();

        if (cancelled) {
          return;
        }

        if (result.success) {
          setCategories(result.categories);
        } else {
          toast.error(result.error || "Failed to load project categories.");
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("[CreateProjectForm] Category loading error:", error);

        toast.error("Failed to load project categories.");
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================================
  // SELECTED CATEGORY
  // ==========================================================

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId),
    [categories, categoryId],
  );

  // ==========================================================
  // TITLE / SLUG
  // ==========================================================

  const handleTitleChange = (value: string) => {
    setTitle(value);

    if (!slugManuallyEdited) {
      setSlug(createProjectCategorySlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);

    setSlug(createProjectCategorySlug(value));
  };

  // ==========================================================
  // BANNER UPLOAD
  // ==========================================================

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !bannerFormRef.current) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, WebP, GIF, AVIF or TIFF images are allowed.");

      bannerFormRef.current.reset();

      return;
    }

    if (file.size === 0) {
      toast.error("That file looks empty. Please select another image.");

      bannerFormRef.current.reset();

      return;
    }

    setUploadingBanner(true);

    const objectUrl = URL.createObjectURL(file);

    setBannerPreview(objectUrl);

    const formData = new FormData(bannerFormRef.current);

    try {
      const result = await uploadBannerAction(formData);

      if (result.success && result.data) {
        setBannerImage(result.data.url);

        setBannerPreview(result.data.url);

        toast.success("Project banner uploaded successfully.");
      } else {
        toast.error("Failed to upload project banner.");

        setBannerPreview(bannerImage);
      }
    } catch (error) {
      console.error("[CreateProjectForm] Banner upload error:", error);

      toast.error("Project banner upload failed.");

      setBannerPreview(bannerImage);
    } finally {
      URL.revokeObjectURL(objectUrl);

      setUploadingBanner(false);

      bannerFormRef.current?.reset();
    }
  };

  // ==========================================================
  // OG UPLOAD
  // ==========================================================

  const handleOgUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !ogFormRef.current) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, WebP, GIF, AVIF or TIFF images are allowed.");

      ogFormRef.current.reset();

      return;
    }

    if (file.size === 0) {
      toast.error("That file looks empty. Please select another image.");

      ogFormRef.current.reset();

      return;
    }

    setUploadingOg(true);

    const objectUrl = URL.createObjectURL(file);

    setOgPreview(objectUrl);

    const formData = new FormData(ogFormRef.current);

    try {
      const result = await uploadOgAction(formData);

      if (result.success && result.data) {
        setOgImage(result.data.url);

        setOgPreview(result.data.url);

        toast.success("Project OG image uploaded successfully.");
      } else {
        toast.error("Failed to upload project OG image.");

        setOgPreview(ogImage);
      }
    } catch (error) {
      console.error("[CreateProjectForm] OG upload error:", error);

      toast.error("Project OG image upload failed.");

      setOgPreview(ogImage);
    } finally {
      URL.revokeObjectURL(objectUrl);

      setUploadingOg(false);

      ogFormRef.current?.reset();
    }
  };

  // ==========================================================
  // REMOVE IMAGES
  // ==========================================================

  const removeBanner = () => {
    setBannerImage("");
    setBannerPreview("");

    toast.info("Project banner removed.");
  };

  const removeOg = () => {
    setOgImage("");
    setOgPreview("");

    toast.info("Project OG image removed.");
  };

  // ==========================================================
  // TECHNOLOGY HANDLERS
  // ==========================================================

  const addTechnology = () => {
    setTechnologies((previous) => [
      ...previous,
      {
        id: createTechnologyId(),
        name: "",
      },
    ]);
  };

  const updateTechnology = (id: string, value: string) => {
    setTechnologies((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              name: value,
            }
          : item,
      ),
    );
  };

  const removeTechnology = (id: string) => {
    setTechnologies((previous) => previous.filter((item) => item.id !== id));
  };

  // ==========================================================
  // VALIDATION
  // ==========================================================

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Project title is required.");

      return false;
    }

    if (!shortDescription.trim()) {
      toast.error("Project short description is required.");

      return false;
    }

    if (!slug.trim()) {
      toast.error("Project slug is required.");

      return false;
    }

    if (!categoryId) {
      toast.error("Please select a project category.");

      return false;
    }

    if (!bannerImage) {
      toast.error("Project banner image is required.");

      return false;
    }

    if (!content?.blocks?.length) {
      toast.error("Project content cannot be empty.");

      return false;
    }

    if (startedAt && !PROJECT_DATE_REGEX.test(startedAt)) {
      toast.error("Please enter a valid start date.");

      return false;
    }

    if (completedAt && !PROJECT_DATE_REGEX.test(completedAt)) {
      toast.error("Please enter a valid completion date.");

      return false;
    }

    if (startedAt && completedAt && startedAt > completedAt) {
      toast.error("Completion date cannot be before the start date.");

      return false;
    }

    return true;
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const cleanedTechnologies = technologies
      .map((technology) => technology.name.trim())
      .filter(Boolean);

    const uniqueTechnologies = Array.from(new Set(cleanedTechnologies));

    const parsedSortOrder = Number.parseInt(sortOrder, 10);

    startTransition(async () => {
      try {
        const result = await createProjectAction({
          title: title.trim(),

          shortDescription: shortDescription.trim(),

          slug: slug.trim(),

          categoryId,

          content,

          bannerImage,

          ogImage: ogImage.trim(),

          liveUrl: liveUrl.trim(),

          githubUrl: githubUrl.trim(),

          demoUrl: demoUrl.trim(),

          caseStudyUrl: caseStudyUrl.trim(),

          technologies: uniqueTechnologies,

          featured,

          published,

          sortOrder: Number.isNaN(parsedSortOrder) ? 0 : parsedSortOrder,

          startedAt: startedAt.trim(),

          completedAt: completedAt.trim(),
        });

        if (result.success) {
          toast.success("Project created successfully!", {
            description: `/${result.data.project.slug}`,
          });

          router.push("/dashboard/projects");

          router.refresh();

          return;
        }

        toast.error(result.error || "Failed to create project.");
      } catch (error) {
        console.error("[CreateProjectForm] Create project error:", error);

        toast.error("Something went wrong while creating the project.");
      }
    });
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-20">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Project</h1>

          <p className="mt-1 text-muted-foreground">
            Showcase your project, technology, content and links.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={isPending || uploadingBanner || uploadingOg}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Project
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ======================================================
          TABS
      ====================================================== */}

      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>

          <TabsTrigger value="preview">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* ====================================================
            WRITE
        ==================================================== */}

        <TabsContent value="write" className="mt-6 space-y-6">
          {/* ==================================================
              BASIC INFO
          ================================================== */}

          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Title */}

              <div className="space-y-2">
                <Label htmlFor="project-title">Project Title *</Label>

                <Input
                  id="project-title"
                  value={title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  placeholder="Enter project title..."
                  className="text-lg"
                  disabled={isPending}
                />
              </div>

              {/* Short Description */}

              <div className="space-y-2">
                <Label htmlFor="project-short-description">Short Description *</Label>

                <textarea
                  id="project-short-description"
                  value={shortDescription}
                  onChange={(event) => setShortDescription(event.target.value)}
                  placeholder="Briefly describe what this project is and why it matters..."
                  disabled={isPending}
                  rows={4}
                  maxLength={500}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />

                <div className="flex justify-end text-xs text-muted-foreground">
                  {shortDescription.length}/500
                </div>
              </div>

              {/* Slug */}

              <div className="space-y-2">
                <Label htmlFor="project-slug">Slug</Label>

                <Input
                  id="project-slug"
                  value={slug}
                  onChange={(event) => handleSlugChange(event.target.value)}
                  placeholder="my-awesome-project"
                  disabled={isPending}
                />

                <p className="text-xs text-muted-foreground">
                  Public URL: /projects/
                  {slug || "your-project-slug"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ==================================================
              CATEGORY
          ================================================== */}

          <Card>
            <CardHeader>
              <CardTitle>Classification</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="max-w-xl space-y-2">
                <Label>Project Category *</Label>

                <Select
                  value={categoryId}
                  onValueChange={setCategoryId}
                  disabled={loadingCategories || isPending}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingCategories ? "Loading categories..." : "Select project category"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedCategory && (
                  <p className="text-xs text-muted-foreground">
                    Category slug: /{selectedCategory.slug}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ==================================================
              IMAGES
          ================================================== */}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Banner */}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Banner Image *
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {bannerPreview ? (
                  <div className="relative">
                    <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
                      <Image
                        src={bannerPreview}
                        alt={title || "Project banner"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={removeBanner}
                      disabled={uploadingBanner || isPending}
                      aria-label="Remove banner"
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white transition-colors hover:bg-black disabled:pointer-events-none disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {bannerImage && (
                      <p className="mt-2 break-all text-xs text-muted-foreground">{bannerImage}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-muted/40">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />

                    <p className="text-sm text-muted-foreground">No banner uploaded</p>
                  </div>
                )}

                <form ref={bannerFormRef} onSubmit={(event) => event.preventDefault()}>
                  <Label htmlFor="project-banner" className="cursor-pointer">
                    <div className="flex w-full items-center justify-center gap-2 rounded-md border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
                      {uploadingBanner ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          {bannerPreview ? "Change Banner" : "Upload Banner"}
                        </>
                      )}
                    </div>
                  </Label>

                  <Input
                    id="project-banner"
                    name="file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/tiff"
                    className="hidden"
                    onChange={handleBannerUpload}
                    disabled={uploadingBanner || isPending}
                  />
                </form>
              </CardContent>
            </Card>

            {/* OG */}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  OG / Social Image
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {ogPreview ? (
                  <div className="relative">
                    <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
                      <Image
                        src={ogPreview}
                        alt={title || "Project OG image"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={removeOg}
                      disabled={uploadingOg || isPending}
                      aria-label="Remove OG image"
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white transition-colors hover:bg-black disabled:pointer-events-none disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {ogImage && (
                      <p className="mt-2 break-all text-xs text-muted-foreground">{ogImage}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-muted/40">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />

                    <p className="text-sm text-muted-foreground">No OG image uploaded</p>
                  </div>
                )}

                <form ref={ogFormRef} onSubmit={(event) => event.preventDefault()}>
                  <Label htmlFor="project-og" className="cursor-pointer">
                    <div className="flex w-full items-center justify-center gap-2 rounded-md border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
                      {uploadingOg ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          {ogPreview ? "Change OG Image" : "Upload OG Image"}
                        </>
                      )}
                    </div>
                  </Label>

                  <Input
                    id="project-og"
                    name="file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/tiff"
                    className="hidden"
                    onChange={handleOgUpload}
                    disabled={uploadingOg || isPending}
                  />
                </form>

                <p className="text-xs text-muted-foreground">
                  Optional. If no OG image is provided, the project banner will be used
                  automatically for social previews.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ==================================================
              LINKS
          ================================================== */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Project Links
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="live-url">Live URL</Label>

                <Input
                  id="live-url"
                  value={liveUrl}
                  onChange={(event) => setLiveUrl(event.target.value)}
                  placeholder="https://example.com"
                  type="url"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github-url" className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4" />
                  GitHub URL
                </Label>

                <Input
                  id="github-url"
                  value={githubUrl}
                  onChange={(event) => setGithubUrl(event.target.value)}
                  placeholder="https://github.com/..."
                  type="url"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-url">Demo URL</Label>

                <Input
                  id="demo-url"
                  value={demoUrl}
                  onChange={(event) => setDemoUrl(event.target.value)}
                  placeholder="https://demo.example.com"
                  type="url"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="case-study-url">Case Study URL</Label>

                <Input
                  id="case-study-url"
                  value={caseStudyUrl}
                  onChange={(event) => setCaseStudyUrl(event.target.value)}
                  placeholder="https://example.com/case-study"
                  type="url"
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>

          {/* ==================================================
              TECHNOLOGIES
          ================================================== */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Technologies</CardTitle>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addTechnology}
                disabled={isPending}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Technology
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {technologies.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Add the technologies, frameworks, tools or services used in this project.
                </p>
              )}

              {technologies.map((technology, index) => (
                <div key={technology.id} className="flex items-center gap-3">
                  <span className="w-8 text-sm text-muted-foreground">{index + 1}.</span>

                  <Input
                    value={technology.name}
                    onChange={(event) => updateTechnology(technology.id, event.target.value)}
                    placeholder="e.g. Next.js"
                    disabled={isPending}
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeTechnology(technology.id)}
                    disabled={isPending}
                    aria-label="Remove technology"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ==================================================
              PROJECT SETTINGS
          ================================================== */}

          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="sort-order">Sort Order</Label>

                <Input
                  id="sort-order"
                  type="number"
                  min={0}
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="started-at" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Started
                </Label>

                <Input
                  id="started-at"
                  type="date"
                  value={startedAt}
                  onChange={(event) => setStartedAt(event.target.value)}
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completed-at" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Completed
                </Label>

                <Input
                  id="completed-at"
                  type="date"
                  value={completedAt}
                  onChange={(event) => setCompletedAt(event.target.value)}
                  disabled={isPending}
                />
              </div>

              <div className="flex flex-col justify-center gap-4">
                <div className="flex items-center gap-3">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                    disabled={isPending}
                  />

                  <Label htmlFor="featured">Featured Project</Label>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={setPublished}
                    disabled={isPending}
                  />

                  <Label htmlFor="published">Publish Project</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ==================================================
              PROJECT CONTENT
          ================================================== */}

          <Card>
            <CardHeader>
              <CardTitle>Project Content *</CardTitle>
            </CardHeader>

            <CardContent>
              <ProjectEditor value={content} onChange={setContent} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====================================================
            PREVIEW
        ==================================================== */}

        <TabsContent value="preview" className="mt-6">
          <div className="min-w-0">
            {bannerPreview && (
              <div className="relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-2xl border bg-muted">
                <Image
                  src={bannerPreview}
                  alt={title || "Project banner"}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <div className="mb-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {selectedCategory && (
                  <span className="rounded-full border px-3 py-1">{selectedCategory.name}</span>
                )}

                {published && <span className="rounded-full border px-3 py-1">Published</span>}

                {featured && <span className="rounded-full border px-3 py-1">Featured</span>}
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {title || "Untitled Project"}
              </h1>

              <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
                {shortDescription || "Your project short description will appear here."}
              </p>
            </div>

            <ProjectPreviewContent content={content} />
          </div>
        </TabsContent>
      </Tabs>

      {/* ======================================================
          MOBILE / BOTTOM ACTION
      ====================================================== */}

      <div className="sticky bottom-4 z-20 flex justify-end">
        <div className="flex items-center gap-3 rounded-xl border bg-background/95 p-2 shadow-lg backdrop-blur">
          <Button variant="outline" onClick={() => router.back()} disabled={isPending}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={isPending || uploadingBanner || uploadingOg}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Project
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
