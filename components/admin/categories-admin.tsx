"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Edit, Trash2, FolderTree, Upload } from "lucide-react";
import { uploadImage } from "@/lib/supabase/storage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string | null;
  parent_id: string | null;
  display_order: number;
  active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    parent_id: "",
    display_order: "0",
    active: true,
    image_url: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("display_order", { ascending: true });

        if (error) throw error;
        setCategories(data || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "Error al cargar las categorías",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        slug: category.slug || "",
        parent_id: category.parent_id || "",
        display_order: category.display_order.toString(),
        active: category.active,
        image_url: category.image_url || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        slug: "",
        parent_id: "",
        display_order: "0",
        active: true,
        image_url: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name) {
      toast({
        title: "Error",
        description: "El nombre es requerido",
        variant: "destructive",
      });
      return;
    }

    try {
      const slug = formData.slug || generateSlug(formData.name);
      const updateData = {
        name: formData.name!,
        description: formData.description || null,
        slug: slug,
        parent_id: formData.parent_id || null,
        display_order: parseInt(formData.display_order) || 0,
        active: formData.active ?? true,
        image_url: formData.image_url || null,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(updateData as any)
          .eq("id", editingCategory.id);

        if (error) throw error;
        toast({
          title: "Categoría actualizada",
          description: "La categoría se actualizó correctamente",
        });
      } else {
        const { error } = await supabase.from("categories").insert(updateData as any);

        if (error) throw error;
        toast({
          title: "Categoría creada",
          description: "La categoría se creó correctamente",
        });
      }

      setDialogOpen(false);
      loadCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al guardar la categoría",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("¿Estás seguro de eliminar esta categoría? Los productos asociados no se eliminarán.")) return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
      toast({
        title: "Categoría eliminada",
        description: "La categoría se eliminó correctamente",
      });
      loadCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar la categoría",
        variant: "destructive",
      });
    }
  };

  const getCategoryPath = (category: Category): string => {
    const parent = categories.find((c) => c.id === category.parent_id);
    if (parent) {
      return `${getCategoryPath(parent)} > ${category.name}`;
    }
    return category.name;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categorías de Productos</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Categoría Padre</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No hay categorías
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {getCategoryPath(category)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {category.slug || "-"}
                    </TableCell>
                    <TableCell>
                      {category.parent_id
                        ? categories.find((c) => c.id === category.parent_id)?.name || "-"
                        : "Raíz"}
                    </TableCell>
                    <TableCell>{category.display_order}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          category.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.active ? "Activa" : "Inactiva"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Modifica los datos de la categoría"
                : "Completa los datos para crear una nueva categoría"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: formData.slug || generateSlug(e.target.value),
                  });
                }}
                placeholder="Ej: Materiales Eléctricos"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="Se genera automáticamente"
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
                placeholder="Descripción de la categoría"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image_url">URL de Imagen</Label>
              <div className="flex gap-2">
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value.trim() })
                  }
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
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="flex-1"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="category-file-upload"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setUploadingImage(true);
                      const result = await uploadImage({
                        file,
                        folder: 'categories',
                        bucket: 'images',
                      });

                      if (result.error) {
                        toast({
                          title: "Error al subir imagen",
                          description: result.error,
                          variant: "destructive",
                        });
                      } else if (result.url) {
                        setFormData({ ...formData, image_url: result.url });
                        toast({
                          title: "Imagen subida",
                          description: "La imagen se subió correctamente",
                        });
                      }
                      setUploadingImage(false);
                      // Limpiar input
                      e.target.value = '';
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      document.getElementById('category-file-upload')?.click();
                    }}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                URL de la imagen descriptiva de la categoría (se mostrará en el home) o sube una imagen directamente
              </p>
              {formData.image_url && formData.image_url.trim() !== "" && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Vista previa"
                    className="w-full h-32 object-cover rounded-md border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'flex items-center justify-center h-full text-xs text-muted-foreground p-2';
                        placeholder.textContent = 'Error al cargar imagen';
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="parent_id">Categoría Padre</Label>
                <Select
                  value={formData.parent_id || "none"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parent_id: value === "none" ? "" : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ninguna (raíz)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguna (raíz)</SelectItem>
                    {categories
                      .filter((c) => c.id !== editingCategory?.id)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="display_order">Orden de Visualización</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="active">Categoría activa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {editingCategory ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

