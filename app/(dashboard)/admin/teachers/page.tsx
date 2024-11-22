"use client";

import { useState, useReducer, useCallback, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  Edit,
  Plus,
  Key,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { debounce } from "lodash";

// Define the Faculty type
type Faculty = {
  id: string;
  name: string;
  email: string;
  department: string;
  specialty: string;
  accountStatus: "inactive" | "pending" | "active";
  temporaryPassword?: string;
};

// Define the Zod schema for faculty validation
const facultySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  department: z
    .string()
    .min(2, "Department must be at least 2 characters long"),
  specialty: z.string().min(2, "Specialty must be at least 2 characters long"),
});

// Define action types for the reducer
type Action =
  | { type: "ADD_FACULTY"; payload: Faculty }
  | { type: "UPDATE_FACULTY"; payload: Faculty }
  | { type: "DELETE_FACULTY"; payload: string }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "LOAD_DUMMY_DATA"; payload: Faculty[] }
  | { type: "SET_PAGE"; payload: number };

// Define the initial state
const initialState = {
  faculties: [] as Faculty[],
  search: "",
  currentPage: 1,
};

// Create the reducer function
function reducer(
  state: typeof initialState,
  action: Action,
): typeof initialState {
  switch (action.type) {
    case "ADD_FACULTY":
      return { ...state, faculties: [...state.faculties, action.payload] };
    case "UPDATE_FACULTY":
      return {
        ...state,
        faculties: state.faculties.map((faculty) =>
          faculty.id === action.payload.id ? action.payload : faculty,
        ),
      };
    case "DELETE_FACULTY":
      return {
        ...state,
        faculties: state.faculties.filter(
          (faculty) => faculty.id !== action.payload,
        ),
      };
    case "SET_SEARCH":
      return { ...state, search: action.payload, currentPage: 1 };
    case "LOAD_DUMMY_DATA":
      return { ...state, faculties: action.payload };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}

// Function to generate a temporary password
function generateTemporaryPassword(): string {
  return Math.random().toString(36).slice(-8);
}

// Create a component for the faculty form
function FacultyForm({
  faculty,
  onSubmit,
  onCancel,
}: {
  faculty: Faculty | null;
  onSubmit: (
    faculty: Omit<Faculty, "id" | "accountStatus" | "temporaryPassword">,
  ) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<
    Omit<Faculty, "id" | "accountStatus" | "temporaryPassword">
  >(
    faculty
      ? {
          name: faculty.name,
          email: faculty.email,
          department: faculty.department,
          specialty: faculty.specialty,
        }
      : {
          name: "",
          email: "",
          department: "",
          specialty: "",
        },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      facultySchema.parse(formData);
      onSubmit(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(error.errors);
        error.errors.forEach((err) => {
          toast.error(`${err.path.join(".")}: ${err.message}`);
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="specialty">Specialty</Label>
        <Input
          id="specialty"
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          required
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </DialogFooter>
    </form>
  );
}

// Create the main component
export default function FacultyManagement() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState<Faculty | null>(null);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(state.faculties.length / itemsPerPage);

  useEffect(() => {
    // Load dummy data
    const dummyData: Faculty[] = [
      {
        id: "1",
        name: "Dr. John Doe",
        email: "john.doe@medcollege.edu",
        department: "Cardiology",
        specialty: "Interventional Cardiology",
        accountStatus: "active",
      },
      {
        id: "2",
        name: "Dr. Jane Smith",
        email: "jane.smith@medcollege.edu",
        department: "Neurology",
        specialty: "Neurosurgery",
        accountStatus: "active",
      },
      {
        id: "3",
        name: "Dr. Mike Johnson",
        email: "mike.johnson@medcollege.edu",
        department: "Pediatrics",
        specialty: "Neonatology",
        accountStatus: "pending",
        temporaryPassword: "temp123",
      },
      {
        id: "4",
        name: "Dr. Sarah Lee",
        email: "sarah.lee@medcollege.edu",
        department: "Oncology",
        specialty: "Radiation Oncology",
        accountStatus: "inactive",
      },
      {
        id: "5",
        name: "Dr. Robert Brown",
        email: "robert.brown@medcollege.edu",
        department: "Surgery",
        specialty: "Cardiothoracic Surgery",
        accountStatus: "active",
      },
      {
        id: "6",
        name: "Dr. Emily Chen",
        email: "emily.chen@medcollege.edu",
        department: "Dermatology",
        specialty: "Pediatric Dermatology",
        accountStatus: "active",
      },
      {
        id: "7",
        name: "Dr. David Wilson",
        email: "david.wilson@medcollege.edu",
        department: "Orthopedics",
        specialty: "Sports Medicine",
        accountStatus: "active",
      },
    ];
    dispatch({ type: "LOAD_DUMMY_DATA", payload: dummyData });
  }, []);

  const handleAddFaculty = (
    faculty: Omit<Faculty, "id" | "accountStatus" | "temporaryPassword">,
  ) => {
    const temporaryPassword = generateTemporaryPassword();
    const newFaculty: Faculty = {
      ...faculty,
      id: Date.now().toString(),
      accountStatus: "pending",
      temporaryPassword,
    };
    dispatch({ type: "ADD_FACULTY", payload: newFaculty });
    setIsDialogOpen(false);
    toast.success("Faculty added successfully", {
      description: `Temporary password: ${temporaryPassword}`,
    });
  };

  const handleUpdateFaculty = (
    faculty: Omit<Faculty, "id" | "accountStatus" | "temporaryPassword">,
  ) => {
    if (currentFaculty) {
      const updatedFaculty: Faculty = {
        ...currentFaculty,
        ...faculty,
      };
      dispatch({ type: "UPDATE_FACULTY", payload: updatedFaculty });
      setIsDialogOpen(false);
      toast.success("Faculty updated successfully");
    }
  };

  const handleDeleteFaculty = (id: string) => {
    dispatch({ type: "DELETE_FACULTY", payload: id });
    toast.success("Faculty deleted successfully");
  };

  const handleActivateAccount = (faculty: Faculty) => {
    const updatedFaculty: Faculty = {
      ...faculty,
      accountStatus: "active",
      temporaryPassword: undefined,
    };
    dispatch({ type: "UPDATE_FACULTY", payload: updatedFaculty });
    toast.success("Account activated successfully");
  };

  const handleResetPassword = (faculty: Faculty) => {
    const temporaryPassword = generateTemporaryPassword();
    const updatedFaculty: Faculty = {
      ...faculty,
      accountStatus: "pending",
      temporaryPassword,
    };
    dispatch({ type: "UPDATE_FACULTY", payload: updatedFaculty });
    toast.success("Password reset successfully", {
      description: `New temporary password: ${temporaryPassword}`,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      dispatch({ type: "SET_SEARCH", payload: value });
    }, 300),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const filteredFaculties = state.faculties.filter((faculty) => {
    const searchTerm = state.search.toLowerCase();
    return (
      faculty.name.toLowerCase().includes(searchTerm) ||
      faculty.email.toLowerCase().includes(searchTerm) ||
      faculty.department.toLowerCase().includes(searchTerm) ||
      faculty.specialty.toLowerCase().includes(searchTerm)
    );
  });

  const paginatedFaculties = filteredFaculties.slice(
    (state.currentPage - 1) * itemsPerPage,
    state.currentPage * itemsPerPage,
  );

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Department",
      "Specialty",
      "Account Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredFaculties.map((f) =>
        [f.name, f.email, f.department, f.specialty, f.accountStatus].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "faculty_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Faculty Management System
          </CardTitle>
          <CardDescription>
            Manage faculty members, their departments, specialties, and account
            statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Input
                  placeholder="Search faculties by name, email, department, or specialty..."
                  onChange={handleSearchChange}
                  className="pl-10"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
          </div>
          <div className="mb-6 flex justify-between items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCurrentFaculty(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Faculty
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {currentFaculty
                      ? "Edit Faculty Information"
                      : "Add New Faculty Member"}
                  </DialogTitle>
                </DialogHeader>
                <FacultyForm
                  faculty={currentFaculty}
                  onSubmit={
                    currentFaculty ? handleUpdateFaculty : handleAddFaculty
                  }
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" /> Export to CSV
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFaculties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No faculties found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedFaculties.map((faculty) => (
                    <TableRow key={faculty.id}>
                      <TableCell>{faculty.name}</TableCell>
                      <TableCell>{faculty.email}</TableCell>
                      <TableCell>{faculty.department}</TableCell>
                      <TableCell>{faculty.specialty}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            faculty.accountStatus === "active"
                              ? "bg-green-200 text-green-800"
                              : faculty.accountStatus === "pending"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-red-200 text-red-800"
                          }`}
                        >
                          {faculty.accountStatus.charAt(0).toUpperCase() +
                            faculty.accountStatus.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => {
                              setCurrentFaculty(faculty);
                              setIsDialogOpen(true);
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteFaculty(faculty.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          {faculty.accountStatus === "pending" && (
                            <Button
                              onClick={() => handleActivateAccount(faculty)}
                              size="sm"
                              variant="outline"
                            >
                              Activate
                            </Button>
                          )}
                          {faculty.accountStatus === "active" && (
                            <Button
                              onClick={() => handleResetPassword(faculty)}
                              size="sm"
                              variant="outline"
                            >
                              Reset Password
                            </Button>
                          )}
                          {faculty.temporaryPassword && (
                            <Button
                              onClick={() => {
                                toast.info(
                                  `Temporary password: ${faculty.temporaryPassword}`,
                                );
                              }}
                              size="sm"
                              variant="outline"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              Showing {(state.currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                state.currentPage * itemsPerPage,
                filteredFaculties.length,
              )}{" "}
              of {filteredFaculties.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  dispatch({ type: "SET_PAGE", payload: state.currentPage - 1 })
                }
                disabled={state.currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm font-medium">
                Page {state.currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  dispatch({ type: "SET_PAGE", payload: state.currentPage + 1 })
                }
                disabled={state.currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
