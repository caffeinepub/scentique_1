import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useAddProduct,
  useGetProduct,
  useUpdateProduct,
} from "../../hooks/useQueries";
import { useIsAdmin } from "../../hooks/useQueries";
import { useUploadImage } from "../../hooks/useStorageClient";

export default function ProductFormPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const isEdit = !!params.id;
  const productId = params.id ? BigInt(params.id) : null;
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: existingProduct } = useGetProduct(productId);
  const { mutateAsync: addProduct, isPending: adding } = useAddProduct();
  const { mutateAsync: updateProduct, isPending: updating } =
    useUpdateProduct();
  const { uploadImage, uploading, progress } = useUploadImage();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [category, setCategory] = useState("unisex");
  const [sizeStr, setSizeStr] = useState("");
  const [stockStr, setStockStr] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageId, setImageId] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setDescription(existingProduct.description);
      setPriceStr((Number(existingProduct.priceInCents) / 100).toFixed(2));
      setCategory(existingProduct.category);
      setSizeStr(existingProduct.sizeML.toString());
      setStockStr(existingProduct.stockQuantity.toString());
      setFeatured(existingProduct.featured);
      setImageId(existingProduct.imageId);
      setImagePreview(existingProduct.imageId);
    }
  }, [existingProduct]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    try {
      const hash = await uploadImage(file);
      setImageId(hash);
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed.");
      setImagePreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceInCents = BigInt(Math.round(Number.parseFloat(priceStr) * 100));
    const sizeML = BigInt(Number.parseInt(sizeStr));
    const stockQuantity = BigInt(Number.parseInt(stockStr));

    const productData = {
      id: productId ?? 0n,
      name,
      description,
      priceInCents,
      category,
      sizeML,
      stockQuantity,
      featured,
      imageId,
    };

    try {
      if (isEdit && productId !== null) {
        await updateProduct({ id: productId, data: productData });
        toast.success("Product updated!");
      } else {
        await addProduct(productData);
        toast.success("Product added!");
      }
      navigate({ to: "/admin" });
    } catch {
      toast.error("Failed to save product.");
    }
  };

  if (!identity || !isAdmin) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center">
        <p className="font-sans text-background/60">Access denied.</p>
      </div>
    );
  }

  const isPending = adding || updating || uploading;

  return (
    <div className="min-h-screen bg-secondary">
      <Toaster richColors position="top-right" />
      <header className="bg-foreground text-background px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-display text-xl text-background opacity-70 hover:opacity-100 transition-opacity"
          >
            Scentique
          </Link>
          <span className="text-background opacity-30">/</span>
          <Link
            to="/admin"
            className="font-sans text-sm opacity-70 hover:opacity-100 transition-opacity tracking-widest uppercase"
          >
            Admin
          </Link>
          <span className="text-background opacity-30">/</span>
          <span className="font-sans text-sm opacity-80 tracking-widest uppercase">
            {isEdit ? "Edit" : "New"} Product
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 font-sans text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
          Back to Dashboard
        </Link>

        <div className="bg-card p-8">
          <h1 className="font-display text-3xl text-foreground mb-8">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label className="font-sans text-xs tracking-widest uppercase text-muted-foreground">
                Product Image
              </Label>
              <div className="mt-2 flex gap-4 items-start">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover"
                  />
                )}
                <label
                  htmlFor="image-upload"
                  className="flex-1 border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer p-6 text-center"
                  data-ocid="admin.product_form.dropzone"
                >
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="font-sans text-sm text-muted-foreground">
                        {progress}% uploaded
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="font-sans text-sm text-muted-foreground">
                        Click to upload image
                      </span>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    data-ocid="admin.product_form.upload_button"
                  />
                </label>
              </div>
            </div>

            <div>
              <Label
                htmlFor="pf-name"
                className="font-sans text-xs tracking-widest uppercase text-muted-foreground"
              >
                Name
              </Label>
              <Input
                id="pf-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 font-sans"
                placeholder="Midnight Cedar"
                data-ocid="admin.product_form.input"
              />
            </div>

            <div>
              <Label
                htmlFor="pf-desc"
                className="font-sans text-xs tracking-widest uppercase text-muted-foreground"
              >
                Description
              </Label>
              <Textarea
                id="pf-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="mt-1 font-sans resize-none"
                placeholder="Describe this fragrance…"
                data-ocid="admin.product_form.textarea"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="pf-price"
                  className="font-sans text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Price (USD)
                </Label>
                <Input
                  id="pf-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={priceStr}
                  onChange={(e) => setPriceStr(e.target.value)}
                  required
                  className="mt-1 font-sans"
                  placeholder="148.00"
                  data-ocid="admin.product_form.input"
                />
              </div>
              <div>
                <Label
                  htmlFor="pf-size"
                  className="font-sans text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Size (ml)
                </Label>
                <Input
                  id="pf-size"
                  type="number"
                  min="1"
                  value={sizeStr}
                  onChange={(e) => setSizeStr(e.target.value)}
                  required
                  className="mt-1 font-sans"
                  placeholder="100"
                  data-ocid="admin.product_form.input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="pf-category"
                  className="font-sans text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    className="mt-1 font-sans"
                    data-ocid="admin.product_form.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men" className="font-sans">
                      Men
                    </SelectItem>
                    <SelectItem value="women" className="font-sans">
                      Women
                    </SelectItem>
                    <SelectItem value="unisex" className="font-sans">
                      Unisex
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="pf-stock"
                  className="font-sans text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Stock Quantity
                </Label>
                <Input
                  id="pf-stock"
                  type="number"
                  min="0"
                  value={stockStr}
                  onChange={(e) => setStockStr(e.target.value)}
                  required
                  className="mt-1 font-sans"
                  placeholder="25"
                  data-ocid="admin.product_form.input"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="pf-featured"
                checked={featured}
                onCheckedChange={setFeatured}
                data-ocid="admin.product_form.switch"
              />
              <Label
                htmlFor="pf-featured"
                className="font-sans text-sm cursor-pointer"
              >
                Feature this product on homepage
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase py-6"
              data-ocid="admin.product_form.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
                </>
              ) : isEdit ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
