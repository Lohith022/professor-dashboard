"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Upload, List, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
  });

  // ✅ Store user name dynamically
  const [userName, setUserName] = useState("Professor");

  useEffect(() => {
    // Fetch dashboard stats
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    }

    fetchStats();

    // ✅ Load user name from localStorage
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  const statCards = [
    {
      name: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-blue-600",
    },
    {
      name: "Present Today",
      value: stats.presentToday,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      name: "Absent Today",
      value: stats.absentToday,
      icon: UserX,
      color: "text-red-500",
    },
  ];

  const quickActions = [
    {
      name: "Upload Today's Photo",
      description: "Upload a class photo to automatically mark attendance",
      icon: Upload,
      link: "/dashboard/upload",
      buttonText: "Upload Photo →",
    },
    {
      name: "View Records",
      description: "Check attendance history and generate reports",
      icon: List,
      link: "/dashboard/records",
      buttonText: "View Records →",
    },
    {
      name: "Manage Students",
      description: "Add, edit, or remove students from your class",
      icon: Settings,
      link: "/dashboard/students",
      buttonText: "Manage Students →",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here’s what’s happening with your classes today.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.name} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-card-foreground">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Card key={action.name} className="p-6 bg-muted/50">
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-center gap-2">
                    <action.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{action.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                  <Link href={action.link}>
                    <Button variant="link" className="p-0 text-primary">
                      {action.buttonText}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
