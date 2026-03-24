import { useState } from "react";
import { Layout } from "@/components/Layout";

import {
  useShippingAreas,
  useCreateShippingArea,
  useUpdateShippingArea,
  useDeleteShippingArea,
  type ShippingArea
} from "../hooks/use-ShippingAreas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2
} from "lucide-react";

import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function ShippingAreas() {

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<ShippingArea | null>(null);

  const { data: areas, isLoading } = useShippingAreas();
  const deleteMutation = useDeleteShippingArea();

  const filteredAreas = areas?.filter((area) => {
    const term = search.toLowerCase();

    return (
      area.name?.en?.toLowerCase().includes(term) ||
      area.name?.ar?.includes(term) ||
      area.city?.toLowerCase().includes(term)
    );
  });

  return (

    <Layout>

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">Shipping Areas</h1>
          <p className="text-muted-foreground">
            Manage delivery zones and shipping prices
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2"/>
          Add Area
        </Button>

      </div>

      <div className="mt-6 flex items-center gap-3">

        <Search className="w-4 h-4"/>

        <Input
          placeholder="Search area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="mt-6 border rounded-lg">

        <Table>

          <TableHeader>

            <TableRow>
              <TableHead>Area</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Shipping Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>

          </TableHeader>

          <TableBody>

            {isLoading ? (

              <TableRow>

                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto"/>
                </TableCell>

              </TableRow>

            ) : filteredAreas?.length === 0 ? (

              <TableRow>

                <TableCell colSpan={5} className="text-center">
                  No areas found
                </TableCell>

              </TableRow>

            ) : (

              filteredAreas.map((area) => (

                <TableRow key={area._id}>

                  <TableCell>

                    <div className="flex flex-col">

                      <span>{area.name?.en}</span>
                      <span className="text-xs text-muted-foreground">
                        {area.name?.ar}
                      </span>

                    </div>

                  </TableCell>

                  <TableCell>{area.city}</TableCell>

                  <TableCell>{area.shippingCost} ₪</TableCell>

                  <TableCell>

                    <Badge variant="outline">
                      {area.status === "active" ? "Active" : "Inactive"}
                    </Badge>

                  </TableCell>

                  <TableCell className="text-right">

                    <DropdownMenu>

                      <DropdownMenuTrigger asChild>

                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4"/>
                        </Button>

                      </DropdownMenuTrigger>

                      <DropdownMenuContent>

                        <DropdownMenuItem
                          onClick={() => setEditingArea(area)}
                        >

                          <Pencil className="w-4 h-4 mr-2"/>
                          Edit

                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {

                            if (confirm("Delete this area?"))
                              deleteMutation.mutate(area._id);

                          }}
                        >

                          <Trash2 className="w-4 h-4 mr-2"/>
                          Delete

                        </DropdownMenuItem>

                      </DropdownMenuContent>

                    </DropdownMenu>

                  </TableCell>

                </TableRow>

              ))

            )}

          </TableBody>

        </Table>

      </div>

      <AreaDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
      />

      {editingArea && (

        <AreaDialog
          open={!!editingArea}
          onOpenChange={() => setEditingArea(null)}
          mode="edit"
          area={editingArea}
        />

      )}

    </Layout>
  );
}

function AreaDialog({ open, onOpenChange, mode, area }) {

  const createMutation = useCreateShippingArea();
  const updateMutation = useUpdateShippingArea();

  const form = useForm({

    defaultValues: {

      name_en: area?.name?.en || "",
      name_ar: area?.name?.ar || "",
      city: area?.city || "",
      shippingCost: area?.shippingCost || "",
      status: area?.status || "active",

    }

  });

  const onSubmit = (data) => {



    const payload = {
        nameAr: data.name_ar,
        nameEn: data.name_en,
        city: data.city,
        shippingCost: Number(data.shippingCost),
        status: data.status
      };

    if (mode === "create") {

      createMutation.mutate(payload);

    } else {

      updateMutation.mutate({
        id: area._id,
        ...payload
      });

    }

    onOpenChange(false);

  };

  return (

    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent>

        <DialogHeader>

          <DialogTitle>

            {mode === "create"
              ? "Add Shipping Area"
              : "Edit Shipping Area"}

          </DialogTitle>

        </DialogHeader>

        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >

            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>Area Name (English)</FormLabel>

                  <FormControl>
                    <Input {...field}/>
                  </FormControl>

                </FormItem>

              )}
            />

            <FormField
              control={form.control}
              name="name_ar"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>Area Name (Arabic)</FormLabel>

                  <FormControl>
                    <Input {...field}/>
                  </FormControl>

                </FormItem>

              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>City</FormLabel>

                  <FormControl>
                    <Input {...field}/>
                  </FormControl>

                </FormItem>

              )}
            />

            <FormField
              control={form.control}
              name="shippingCost"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>Shipping Cost</FormLabel>

                  <FormControl>
                    <Input type="number" {...field}/>
                  </FormControl>

                </FormItem>

              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (

                <FormItem>

                  <FormLabel>Status</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >

                    <FormControl>

                      <SelectTrigger>
                        <SelectValue/>
                      </SelectTrigger>

                    </FormControl>

                    <SelectContent>

                      <SelectItem value="active">
                        Active
                      </SelectItem>

                      <SelectItem value="inactive">
                        Inactive
                      </SelectItem>

                    </SelectContent>

                  </Select>

                </FormItem>

              )}
            />

            <Button type="submit" className="w-full">

              {mode === "create"
                ? "Create Area"
                : "Update Area"}

            </Button>

          </form>

        </Form>

      </DialogContent>

    </Dialog>
  );
}