"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios-config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Types
type Admin = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  phone_number: string;
  branch_id: string;
  username: string;
  role: string;
  is_active: boolean;
  is_superuser: boolean;
  updated_at: string;
};

// Zod schema
const adminSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.string().optional(),
  phone_number: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AdminFormData = z.infer<typeof adminSchema>;

// API functions
const createAdmin = async ({
  data,
}: {
  data: AdminFormData;
}): Promise<Admin> => {
  const response = await api.post(`/admin/create-teacher`, data);
  return response.data;
};

const updateAdmin = async ({
  ...data
}: AdminFormData & { userId: string }): Promise<Admin> => {
  const response = await api.put(`/admin/update-teacher`, data);
  return response.data;
};

const deleteAdmin = async (userId: string): Promise<void> => {
  await api.delete(`/admin/delete-teacher/${userId}`);
};

const fetchAdmins = async (): Promise<Admin[]> => {
  const response = await api.get(`/admin/teachers`);
  return response.data;
};

// Main component
export default function AdminManagement() {
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
      phone_number: "",
      password: "",
    },
  });

  const {
    data: admins,
    isLoading,
    isError,
    error,
  } = useQuery<Admin[], Error>({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });

  const createMutation = useMutation({
    mutationFn: (data: AdminFormData) => createAdmin({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin created successfully");
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(`Error creating admin: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin updated successfully");
      setEditingAdmin(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(`Error updating admin: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("Admin deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Error deleting admin: ${error.message}`);
    },
  });

  const onSubmit = (data: AdminFormData) => {
    if (editingAdmin) {
      updateMutation.mutate({ ...data, userId: editingAdmin.user_id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    form.reset({
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      gender: admin.gender,
      phone_number: admin.phone_number,
      password: "", // Don't set the password when editing
    });
  };

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      deleteMutation.mutate(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="container p-6 space-y-8">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="mt-4 h-16 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Error Loading Teachers
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {error?.message ||
            "An unexpected error occurred while loading the teacher list"}
        </p>
        <Button
          variant="outline"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["admins"] })
          }
        >
          Try Again
        </Button>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher Management</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter first name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter last name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-1 lg:col-span-2 flex items-center space-x-4">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editingAdmin ? "Update Teacher" : "Create Teacher"}
            </Button>
            {editingAdmin && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingAdmin(null);
                  form.reset();
                }}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="mb-4">
        <Input
          placeholder="Search teachers..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins
            ?.filter((admin) =>
              `${admin.first_name} ${admin.last_name}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
            )
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((admin) => (
              <TableRow key={admin.user_id}>
                <TableCell>{`${admin.first_name} ${admin.last_name}`}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.gender}</TableCell>
                <TableCell>{admin.phone_number}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => handleEdit(admin)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(admin.user_id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of{" "}
          {Math.ceil((admins?.length || 0) / itemsPerPage)}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil((admins?.length || 0) / itemsPerPage),
              ),
            )
          }
          disabled={
            currentPage === Math.ceil((admins?.length || 0) / itemsPerPage)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
