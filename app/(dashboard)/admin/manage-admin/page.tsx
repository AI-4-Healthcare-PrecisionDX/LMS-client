"use client";

import {
  createAdmin,
  fetchAdmins,
  updateAdmin,
} from "@/components/brand/admin/manage/admin/query";
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
import { AdminFormData, adminSchema } from "@/schema";
import { Admin } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

  // const deleteMutation = useMutation({
  //   mutationFn: deleteAdmin,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["admins"] });
  //     toast.success("Admin deleted successfully");
  //   },
  //   onError: (error: Error) => {
  //     toast.error(`Error deleting admin: ${error.message}`);
  //   },
  // });

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
      password: "",
    });
  };

  // const handleDelete = (userId: string) => {
  //   if (window.confirm("Are you sure you want to delete this admin?")) {
  //     deleteMutation.mutate(userId);
  //   }
  // };

  if (isLoading) {
    return <CaseLoadingSkeleton />;
  }

  if (isError) {
    return <ErrorMessage error={error} title="Error Loading Admins" />;
  }

  const filteredAdmins =
    admins?.filter((admin) =>
      `${admin.first_name} ${admin.last_name} ${admin.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    ) || [];
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Management</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-8 lg:grid lg:grid-cols-2 lg:gap-4"
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

          <div className="lg:col-span-2">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editingAdmin ? "Update Admin" : "Create Admin"}
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

      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search by name or email"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>
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
            {filteredAdmins
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
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(admin)}
                      >
                        Edit
                      </Button>
                      {/* <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(admin.user_id)}
                      >
                        Delete
                      </Button> */}
                    </div>
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
          {Math.ceil(filteredAdmins.length / itemsPerPage)}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(filteredAdmins.length / itemsPerPage),
              ),
            )
          }
          disabled={
            currentPage === Math.ceil(filteredAdmins.length / itemsPerPage)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
