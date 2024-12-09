"use client";

import ErrorMessage from "@/components/brand/shared/error";
import CaseLoadingSkeleton from "@/components/brand/shared/loading";
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
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
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

  if (isLoading) {
    return <CaseLoadingSkeleton />;
  }

  if (isError) {
    return <ErrorMessage error={error} title="Error Loading Students" />;
  }

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

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Gender</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins
              ?.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage,
              )
              .map((admin) => (
                <TableRow key={admin.user_id}>
                  <TableCell className="font-medium">
                    {`${admin.first_name} ${admin.last_name}`}
                    <div className="md:hidden mt-1 text-sm text-gray-500">
                      {admin.email}
                    </div>
                    <div className="md:hidden mt-1 text-sm text-gray-500">
                      {admin.phone_number}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {admin.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {admin.gender}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {admin.phone_number}
                  </TableCell>
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
