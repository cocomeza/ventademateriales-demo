"use client";

import { useEffect, useState } from "react";
import { Product, ProductImage, ProductVariant, ProductInsert, ProductUpdate } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { mockProducts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2, Loader2, X, ArrowUp, ArrowDown, Upload } from "lucide-react";
import { uploadImage } from "@/lib/supabase/storage";
import { formatPrice } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    wholesale_price: "",
    stock: "",
    min_stock: "10",
    sku: "",
    barcode: "",
    category: "",
  });
  const [productImages, setProductImages] = useState<Array<{ url: string; alt_text: string; display_order: number }>>([]);
  const [productVariants, setProductVariants] = useState<Array<{ name: string; variant_type: 'size' | 'color' | 'model' | 'other'; value: string; price_modifier: string; stock: string; sku: string; barcode: string }>>([]);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            images:product_images(*)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        // Procesar productos con imágenes y variantes
        const productsWithData = (data || []).map((product: any) => ({
          ...product,
          images: product.images?.sort((a: ProductImage, b: ProductImage) => 
            a.display_order - b.display_order
          ) || [],
          variants: product.variants || [],
        }));
        setProducts(productsWithData);
      } else {
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        base_price: product.base_price.toString(),
        wholesale_price: product.wholesale_price?.toString() || "",
        stock: product.stock.toString(),
        min_stock: product.min_stock?.toString() || "10",
        sku: product.sku || "",
        barcode: product.barcode || "",
        category: product.category,
      });

      // Cargar imágenes del producto
      if (isSupabaseConfigured() && supabase && product.id) {
        const { data: images } = await supabase
          .from("product_images")
          .select("*")
          .eq("product_id", product.id)
          .order("display_order");
        
        setProductImages(
          images?.map((img: any) => ({
            url: img.image_url,
            alt_text: img.alt_text || "",
            display_order: img.display_order,
          })) || []
        );
      } else if (product.images && product.images.length > 0) {
        setProductImages(
          product.images.map((img) => ({
            url: img.image_url,
            alt_text: img.alt_text || "",
            display_order: img.display_order,
          }))
        );
      } else {
        setProductImages([]);
      }

      // Cargar variantes del producto
      if (isSupabaseConfigured() && supabase && product.id) {
        const { data: variants } = await supabase
          .from("product_variants")
          .select("*")
          .eq("product_id", product.id);
        
        setProductVariants(
          variants?.map((v: any) => ({
            name: v.name,
            variant_type: v.variant_type,
            value: v.value,
            price_modifier: v.price_modifier.toString(),
            stock: v.stock.toString(),
            sku: v.sku || "",
            barcode: v.barcode || "",
          })) || []
        );
      } else if (product.variants && product.variants.length > 0) {
        setProductVariants(
          product.variants.map((v) => ({
            name: v.name,
            variant_type: v.variant_type,
            value: v.value,
            price_modifier: v.price_modifier.toString(),
            stock: v.stock.toString(),
            sku: v.sku || "",
            barcode: v.barcode || "",
          }))
        );
      } else {
        setProductVariants([]);
      }
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        base_price: "",
        wholesale_price: "",
        stock: "",
        min_stock: "10",
        sku: "",
        barcode: "",
        category: "",
      });
      setProductImages([]);
      setProductVariants([]);
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (saving) return; // Prevenir múltiples submits

    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    // Validación básica
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es requerido",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "La categoría es requerida",
        variant: "destructive",
      });
      return;
    }

    if (!formData.base_price || isNaN(parseFloat(formData.base_price)) || parseFloat(formData.base_price) <= 0) {
      toast({
        title: "Error",
        description: "El precio base debe ser un número válido mayor a 0",
        variant: "destructive",
      });
      return;
    }

    if (!formData.stock || isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      toast({
        title: "Error",
        description: "El stock debe ser un número válido mayor o igual a 0",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      console.log("Iniciando guardado de producto...", { formData, editingProduct });
      const productData: ProductInsert = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        base_price: parseFloat(formData.base_price),
        wholesale_price: formData.wholesale_price && formData.wholesale_price.trim() ? parseFloat(formData.wholesale_price) : null,
        stock: parseInt(formData.stock),
        min_stock: parseInt(formData.min_stock) || 10,
        sku: formData.sku?.trim() || null,
        barcode: formData.barcode?.trim() || null,
        category: formData.category,
      };

      let productId: string;

      if (editingProduct) {
        // Type assertion needed because Supabase client doesn't have generated types
        const updateData: ProductUpdate = productData;
        const { error } = await supabase
          .from("products")
          // @ts-expect-error - Supabase client doesn't have generated database types
          .update(updateData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        productId = editingProduct.id;
        toast({
          title: "Producto actualizado",
          description: "El producto se actualizó correctamente",
        });
      } else {
        // Type assertion needed because Supabase client doesn't have generated types
        const { data: newProduct, error } = await supabase
          .from("products")
          // @ts-expect-error - Supabase client doesn't have generated database types
          .insert(productData)
          .select()
          .single();

        if (error) throw error;
        productId = (newProduct as Product).id;
        toast({
          title: "Producto creado",
          description: "El producto se creó correctamente",
        });
      }

      // Guardar imágenes y variantes
      if (productId) {
        // Eliminar imágenes existentes
        await supabase
          .from("product_images")
          .delete()
          .eq("product_id", productId);

        // Insertar nuevas imágenes
        if (productImages.length > 0) {
          const imagesToInsert = productImages
            .filter(img => img.url.trim() !== "")
            .map((img, index) => ({
              product_id: productId,
              image_url: img.url,
              alt_text: img.alt_text || null,
              display_order: index,
            }));

          if (imagesToInsert.length > 0) {
            const { error: imagesError } = await supabase
              .from("product_images")
              // @ts-expect-error - Supabase client doesn't have generated database types
              .insert(imagesToInsert);

            if (imagesError) throw imagesError;
          }
        }

        // Eliminar variantes existentes
        await supabase
          .from("product_variants")
          .delete()
          .eq("product_id", productId);

        // Insertar nuevas variantes
        if (productVariants.length > 0) {
          const variantsToInsert = productVariants
            .filter(v => v.name.trim() !== "" && v.value.trim() !== "")
            .map((v) => ({
              product_id: productId,
              name: v.name,
              variant_type: v.variant_type,
              value: v.value,
              price_modifier: parseFloat(v.price_modifier) || 0,
              stock: parseInt(v.stock) || 0,
              sku: v.sku || null,
              barcode: v.barcode || null,
            }));

          if (variantsToInsert.length > 0) {
            const { error: variantsError } = await supabase
              .from("product_variants")
              // @ts-expect-error - Supabase client doesn't have generated database types
              .insert(variantsToInsert);

            if (variantsError) throw variantsError;
          }
        }
      }

      setDialogOpen(false);
      await loadProducts();
      console.log("Producto guardado exitosamente");
    } catch (error: any) {
      console.error("Error al guardar producto:", error);
      toast({
        title: "Error",
        description: error.message || "Error al guardar el producto",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await (supabase.from("products") as any).delete().eq("id", id);

      if (error) throw error;
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó correctamente",
      });
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el producto",
        variant: "destructive",
      });
    }
  };

  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Modifica los datos del producto"
                  : "Completa los datos del nuevo producto"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="base_price">Precio Base *</Label>
                    <Input
                      id="base_price"
                      type="number"
                      step="0.01"
                      value={formData.base_price}
                      onChange={(e) =>
                        setFormData({ ...formData, base_price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="wholesale_price">Precio Mayorista</Label>
                    <Input
                      id="wholesale_price"
                      type="number"
                      step="0.01"
                      value={formData.wholesale_price}
                      onChange={(e) =>
                        setFormData({ ...formData, wholesale_price: e.target.value })
                      }
                      placeholder="Opcional"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="min_stock">Stock Mínimo *</Label>
                    <Input
                      id="min_stock"
                      type="number"
                      value={formData.min_stock}
                      onChange={(e) =>
                        setFormData({ ...formData, min_stock: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="Código único"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="barcode">Código de Barras</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData({ ...formData, barcode: e.target.value })
                      }
                      placeholder="EAN/UPC"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">Nueva categoría</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.category === "new" && (
                    <Input
                      placeholder="Nombre de la nueva categoría"
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Imágenes del Producto</Label>
                  <div className="space-y-2">
                    {productImages.map((img, index) => (
                      <div key={index} className="flex gap-2 items-start border p-2 rounded">
                        <div className="relative w-20 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
                          {img.url && img.url.trim() !== "" ? (
                            <Image
                              src={img.url}
                              alt={img.alt_text || `Imagen ${index + 1}`}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                // Si la imagen falla, mostrar placeholder
                                const target = e.target as HTMLImageElement;
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector('.error-placeholder')) {
                                  target.style.display = 'none';
                                  const placeholder = document.createElement('div');
                                  placeholder.className = 'error-placeholder flex items-center justify-center h-full text-xs text-muted-foreground';
                                  placeholder.textContent = 'Error';
                                  parent.appendChild(placeholder);
                                }
                              }}
                              unoptimized={img.url.startsWith('http://localhost') || img.url.startsWith('data:')}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                              Sin imagen
                            </div>
                          )}
                        </div>
                        <div className="flex-1 grid gap-2">
                          <div className="flex gap-2">
                            <Input
                              type="url"
                              placeholder="URL de la imagen (https://...)"
                              value={img.url}
                              onChange={(e) => {
                                const newImages = [...productImages];
                                newImages[index].url = e.target.value.trim();
                                setProductImages(newImages);
                              }}
                              onBlur={(e) => {
                                // Validar URL básica
                                const url = e.target.value.trim();
                                if (url && !url.match(/^https?:\/\/.+/i) && !url.startsWith('data:') && !url.startsWith('/')) {
                                  toast({
                                    title: "URL inválida",
                                    description: "La URL debe comenzar con http:// o https://",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="flex-1"
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id={`file-upload-${index}`}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  setUploadingImageIndex(index);
                                  const result = await uploadImage({
                                    file,
                                    folder: 'products',
                                    bucket: 'images',
                                  });

                                  if (result.error) {
                                    toast({
                                      title: "Error al subir imagen",
                                      description: result.error,
                                      variant: "destructive",
                                    });
                                  } else if (result.url) {
                                    const newImages = [...productImages];
                                    newImages[index].url = result.url;
                                    setProductImages(newImages);
                                    toast({
                                      title: "Imagen subida",
                                      description: "La imagen se subió correctamente",
                                    });
                                  }
                                  setUploadingImageIndex(null);
                                  // Limpiar input
                                  e.target.value = '';
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  document.getElementById(`file-upload-${index}`)?.click();
                                }}
                                disabled={uploadingImageIndex === index}
                              >
                                {uploadingImageIndex === index ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Upload className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <Input
                            placeholder="Texto alternativo (opcional)"
                            value={img.alt_text}
                            onChange={(e) => {
                              const newImages = [...productImages];
                              newImages[index].alt_text = e.target.value;
                              setProductImages(newImages);
                            }}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newImages = [...productImages];
                                [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
                                setProductImages(newImages);
                              }}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                          )}
                          {index < productImages.length - 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newImages = [...productImages];
                                [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
                                setProductImages(newImages);
                              }}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setProductImages(productImages.filter((_, i) => i !== index));
                            }}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setProductImages([...productImages, { url: "", alt_text: "", display_order: productImages.length }]);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Imagen
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Variantes del Producto</Label>
                  <div className="space-y-2">
                    {productVariants.map((variant, index) => (
                      <div key={index} className="border p-3 rounded space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Nombre de la variante (ej: Tamaño)"
                            value={variant.name}
                            onChange={(e) => {
                              const newVariants = [...productVariants];
                              newVariants[index].name = e.target.value;
                              setProductVariants(newVariants);
                            }}
                          />
                          <Select
                            value={variant.variant_type}
                            onValueChange={(value: any) => {
                              const newVariants = [...productVariants];
                              newVariants[index].variant_type = value;
                              setProductVariants(newVariants);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="size">Tamaño</SelectItem>
                              <SelectItem value="color">Color</SelectItem>
                              <SelectItem value="model">Modelo</SelectItem>
                              <SelectItem value="other">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <Input
                            placeholder="Valor (ej: Grande)"
                            value={variant.value}
                            onChange={(e) => {
                              const newVariants = [...productVariants];
                              newVariants[index].value = e.target.value;
                              setProductVariants(newVariants);
                            }}
                          />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Modificador precio"
                            value={variant.price_modifier}
                            onChange={(e) => {
                              const newVariants = [...productVariants];
                              newVariants[index].price_modifier = e.target.value;
                              setProductVariants(newVariants);
                            }}
                          />
                          <Input
                            type="number"
                            placeholder="Stock"
                            value={variant.stock}
                            onChange={(e) => {
                              const newVariants = [...productVariants];
                              newVariants[index].stock = e.target.value;
                              setProductVariants(newVariants);
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setProductVariants(productVariants.filter((_, i) => i !== index));
                            }}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="SKU (opcional)"
                            value={variant.sku}
                            onChange={(e) => {
                              const newVariants = [...productVariants];
                              newVariants[index].sku = e.target.value;
                              setProductVariants(newVariants);
                            }}
                          />
                          <Input
                            placeholder="Código de barras (opcional)"
                            value={variant.barcode}
                            onChange={(e) => {
                              const newVariants = [...productVariants];
                              newVariants[index].barcode = e.target.value;
                              setProductVariants(newVariants);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setProductVariants([...productVariants, { 
                          name: "", 
                          variant_type: "size", 
                          value: "", 
                          price_modifier: "0", 
                          stock: "0",
                          sku: "",
                          barcode: "",
                        }]);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Variante
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingProduct ? "Actualizando..." : "Creando..."}
                    </>
                  ) : (
                    editingProduct ? "Actualizar" : "Crear"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No hay productos
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku || "-"}
                    </TableCell>
                    <TableCell>{formatPrice(product.base_price)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          product.stock <= product.min_stock
                            ? "text-destructive font-semibold"
                            : product.stock <= product.min_stock * 2
                            ? "text-yellow-600 font-semibold"
                            : ""
                        }
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>{product.min_stock || 10}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

