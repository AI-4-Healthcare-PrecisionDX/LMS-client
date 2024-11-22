import api from "@/lib/axios-config";
import { AdminFormData } from "@/schema";
import { Admin } from "@/types";

export const createAdmin = async ({
  data,
}: {
  data: AdminFormData;
}): Promise<Admin> => {
  const response = await api.post(`/admin/create-admin`, data);
  return response.data;
};

export const updateAdmin = async ({
  ...data
}: AdminFormData & { userId: string }): Promise<Admin> => {
  const response = await api.put(`/admin/update-admin`, data);
  return response.data;
};

export const deleteAdmin = async (userId: string): Promise<void> => {
  await api.delete(`/admin/delete-admin/${userId}`);
};

export const fetchAdmins = async (): Promise<Admin[]> => {
  const response = await api.get(`/admin/admins`);
  return response.data;
};
