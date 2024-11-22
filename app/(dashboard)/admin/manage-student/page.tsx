"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import api from "@/lib/axios-config";
import { AxiosError } from "axios";

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
  matric_id: z.string().min(6).max(10),
});

type AdminFormData = z.infer<typeof adminSchema>;

// API functions
const createStudent = async ({
  data,
}: {
  data: AdminFormData;
}): Promise<Admin> => {
  const response = await api.post(`/admin/create-student`, data);
  return response.data;
};

const updateStudent = async ({
  ...data
}: AdminFormData & { userId: string }): Promise<Admin> => {
  const response = await api.put(`/admin/update-student`, data);
  return response.data;
};

// const deleteAdmin = async (userId: string): Promise<void> => {
//   await api.delete(`/admin/delete-student/${userId}`);
// };

const fetchAdmins = async (): Promise<Admin[]> => {
  const response = await api.get(`/admin/students`);
  return response.data;
};

// Main component
export default function AdminManagement() {
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
      phone_number: "",
      password: "",
      matric_id: "",
    },
  });

  const {
    data: admins,
    isLoading,
    isError,
    error,
  } = useQuery<Admin[], AxiosError>({
    queryKey: ["manage-students"],
    queryFn: fetchAdmins,
  });

  const createMutation = useMutation({
    mutationFn: (data: AdminFormData) => createStudent({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-students"] });
      toast.success("Admin created successfully");
      form.reset();
    },
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error(`${(error.response?.data as { detail: string })?.detail}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-students"] });
      toast.success("Admin updated successfully");
      setEditingAdmin(null);
      form.reset();
    },
    onError: (error: AxiosError) => {
      toast.error((error.response?.data as { detail: string }).detail);
    },
  });

  //   const deleteMutation = useMutation({
  //     mutationFn: deleteAdmin,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["manage-students"] });
  //       toast.success("Admin deleted successfully");
  //     },
  //     onError: (error: Error) => {
  //       toast.error(`Error deleting admin: ${error.message}`);
  //     },
  //   });

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

  //   const handleDelete = (userId: string) => {
  //     if (window.confirm("Are you sure you want to delete this admin?")) {
  //       deleteMutation.mutate(userId);
  //     }
  //   };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive" className="dark:bg-red-900 dark:text-red-200">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(error?.response?.data as { detail: string })?.detail ||
              "An error occurred while loading admins. Please try again."}
          </AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>
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
                  <Input {...field} type="email" placeholder="Enter email" />
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
          <FormField
            control={form.control}
            name="matric_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matric ID</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Enter matric ID" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-1 lg:col-span-2 flex items-center">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editingAdmin ? "Update Student" : "Create Student"}
            </Button>
            {editingAdmin && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingAdmin(null);
                  form.reset();
                }}
                className="ml-2"
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </Form>

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
          {admins?.map((admin) => (
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
                {/* <Button
        variant="destructive"
        onClick={() => handleDelete(admin.user_id)}
        >
        Delete
        </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
