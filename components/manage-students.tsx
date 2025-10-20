"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Upload } from "lucide-react";

interface Student {
  student_id: string;
  name: string;
  email: string;
  department: string;
  photo_name?: string;
}

export default function ManageStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Student>({
    student_id: "",
    name: "",
    email: "",
    department: "",
    photo_name: "",
  });

  // ✅ Load data from DynamoDB
  async function fetchStudents() {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data.items || []);
    } catch (err) {
      console.error("Error loading students:", err);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Add or update student
  async function handleSave() {
    if (!newStudent.name || !newStudent.student_id || !newStudent.email || !newStudent.department) {
      alert("Please fill all fields!");
      return;
    }

    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    });

    setNewStudent({ student_id: "", name: "", email: "", department: "", photo_name: "" });
    setIsAddDialogOpen(false);
    setEditingStudent(null);
    fetchStudents();
  }

  // ✅ Delete student
  async function handleDelete(student_id: string) {
    if (!confirm("Delete this student?")) return;

    await fetch("/api/students", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id }),
    });

    fetchStudents();
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Students</h1>
        <p className="text-muted-foreground mt-1">Add, edit, and manage students in your class.</p>
      </div>

      {/* Search + Add */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-popover border-border">
                <DialogHeader>
                  <DialogTitle className="text-popover-foreground">
                    {editingStudent ? "Edit Student" : "Add New Student"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Student ID</Label>
                    <Input
                      value={newStudent.student_id}
                      onChange={(e) => setNewStudent({ ...newStudent, student_id: e.target.value })}
                      placeholder="Enter Student ID"
                      disabled={!!editingStudent}
                    />
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      placeholder="Enter student's full name"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input
                      value={newStudent.department}
                      onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                      placeholder="Enter department"
                    />
                  </div>
                  <div>
                    <Label>Photo Name</Label>
                    <Input
                      value={newStudent.photo_name}
                      onChange={(e) => setNewStudent({ ...newStudent, photo_name: e.target.value })}
                      placeholder="e.g., adithya.png"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
                      {editingStudent ? "Update Student" : "Add Student"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingStudent(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.student_id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      student.photo_name
                        ? `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${student.photo_name}`
                        : "/placeholder.svg"
                    }
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-card-foreground">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {student.student_id} • {student.email} • {student.department}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingStudent(student);
                      setNewStudent(student);
                      setIsAddDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(student.student_id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
