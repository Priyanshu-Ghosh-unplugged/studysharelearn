import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, X, Plus, Clock, BookOpen, IndianRupee, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";

interface TutorProfile {
  id: string;
  user_id: string;
  bio: string | null;
  education: string | null;
  experience_years: number | null;
  hourly_rate: number | null;
  subjects: string[] | null;
  available_slots: Json;
  is_verified: boolean | null;
  rating: number | null;
  total_sessions: number | null;
}

interface AvailabilitySlot {
  day: string;
  start: string;
  end: string;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TutorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isTutor, setIsTutor] = useState(false);

  // Form state
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(200);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);

  // New slot form
  const [newSlotDay, setNewSlotDay] = useState("Monday");
  const [newSlotStart, setNewSlotStart] = useState("09:00");
  const [newSlotEnd, setNewSlotEnd] = useState("10:00");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkTutorRole();
    }
  }, [user]);

  const checkTutorRole = async () => {
    if (!user) return;

    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError || roleData?.role !== "tutor") {
      toast({
        title: "Access Denied",
        description: "Only tutors can access this dashboard.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsTutor(true);
    fetchTutorProfile();
  };

  const fetchTutorProfile = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("tutor_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching tutor profile:", error);
      toast({
        title: "Error",
        description: "Failed to load your profile.",
        variant: "destructive",
      });
    } else if (data) {
      setProfile(data);
      setBio(data.bio || "");
      setEducation(data.education || "");
      setExperienceYears(data.experience_years || 0);
      setHourlyRate(data.hourly_rate || 200);
      setSubjects(data.subjects || []);
      // Parse available_slots safely
      const slots = Array.isArray(data.available_slots) 
        ? (data.available_slots as unknown as AvailabilitySlot[]) 
        : [];
      setAvailableSlots(slots);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    const { error } = await supabase
      .from("tutor_profiles")
      .update({
        bio,
        education,
        experience_years: experienceYears,
        hourly_rate: hourlyRate,
        subjects,
        available_slots: availableSlots as unknown as Json,
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    }
  };

  const addSubject = () => {
    const trimmed = newSubject.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setNewSubject("");
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter((s) => s !== subject));
  };

  const addAvailabilitySlot = () => {
    if (newSlotStart >= newSlotEnd) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    const newSlot: AvailabilitySlot = {
      day: newSlotDay,
      start: newSlotStart,
      end: newSlotEnd,
    };

    setAvailableSlots([...availableSlots, newSlot]);
  };

  const removeAvailabilitySlot = (index: number) => {
    setAvailableSlots(availableSlots.filter((_, i) => i !== index));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isTutor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Tutor Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your profile and availability</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Bio & Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                About You
              </CardTitle>
              <CardDescription>Tell students about yourself and your qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Share your teaching philosophy, experience, and what makes you a great tutor..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    placeholder="e.g., B.Tech from IIT Delhi"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min={0}
                    max={50}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Subjects
              </CardTitle>
              <CardDescription>Add the subjects you can teach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubject())}
                />
                <Button onClick={addSubject} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No subjects added yet</p>
                ) : (
                  subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="px-3 py-1 text-sm">
                      {subject}
                      <button
                        onClick={() => removeSubject(subject)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hourly Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" />
                Hourly Rate
              </CardTitle>
              <CardDescription>Set your rate per session (₹85–₹425 recommended after 15% platform fee)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-xs">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min={50}
                    max={1000}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value) || 200)}
                    className="pl-9"
                  />
                </div>
                <span className="text-muted-foreground">per hour</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your earnings after 15% platform fee: ₹{Math.round(hourlyRate * 0.85)} per hour
              </p>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Availability
              </CardTitle>
              <CardDescription>Set your available time slots for sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 items-end">
                <div className="space-y-1">
                  <Label>Day</Label>
                  <select
                    value={newSlotDay}
                    onChange={(e) => setNewSlotDay(e.target.value)}
                    className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Start</Label>
                  <Input
                    type="time"
                    value={newSlotStart}
                    onChange={(e) => setNewSlotStart(e.target.value)}
                    className="w-32"
                  />
                </div>
                <div className="space-y-1">
                  <Label>End</Label>
                  <Input
                    type="time"
                    value={newSlotEnd}
                    onChange={(e) => setNewSlotEnd(e.target.value)}
                    className="w-32"
                  />
                </div>
                <Button onClick={addAvailabilitySlot} variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Slot
                </Button>
              </div>

              <div className="space-y-2">
                {availableSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No availability slots added yet</p>
                ) : (
                  availableSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-foreground">{slot.day}</span>
                        <span className="text-muted-foreground">
                          {slot.start} - {slot.end}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAvailabilitySlot(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats (Read-only) */}
          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">{profile.total_sessions || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">{profile.rating || 0}</p>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {profile.is_verified ? "Yes" : "Pending"}
                    </p>
                    <p className="text-sm text-muted-foreground">Verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
