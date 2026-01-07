import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, Star, MessageSquare, User, BookOpen } from "lucide-react";
import { format, isPast, isFuture } from "date-fns";

interface Booking {
  id: string;
  subject: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  notes: string | null;
  tutor_id: string;
  tutor_profile?: {
    full_name: string | null;
    email: string;
  };
}

interface Session {
  id: string;
  booking_id: string;
  started_at: string | null;
  ended_at: string | null;
  student_rating: number | null;
  student_feedback: string | null;
}

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sessions, setSessions] = useState<Record<string, Session>>({});
  const [loading, setLoading] = useState(true);
  const [isStudent, setIsStudent] = useState(false);

  // Feedback state
  const [feedbackBookingId, setFeedbackBookingId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      checkStudentRole();
    }
  }, [user]);

  const checkStudentRole = async () => {
    if (!user) return;

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleData?.role !== "student") {
      toast({
        title: "Access Denied",
        description: "Only students can access this dashboard.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsStudent(true);
    fetchBookings();
  };

  const fetchBookings = async () => {
    if (!user) return;

    setLoading(true);

    // Fetch bookings with tutor profile info
    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("student_id", user.id)
      .order("scheduled_at", { ascending: false });

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      toast({
        title: "Error",
        description: "Failed to load your bookings.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Fetch tutor profiles for all bookings
    if (bookingsData && bookingsData.length > 0) {
      const tutorIds = [...new Set(bookingsData.map(b => b.tutor_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", tutorIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      const enrichedBookings = bookingsData.map(b => ({
        ...b,
        tutor_profile: profileMap.get(b.tutor_id)
      }));

      setBookings(enrichedBookings);

      // Fetch sessions for completed bookings
      const { data: sessionsData } = await supabase
        .from("sessions")
        .select("*")
        .in("booking_id", bookingsData.map(b => b.id));

      if (sessionsData) {
        const sessionsMap: Record<string, Session> = {};
        sessionsData.forEach(s => {
          sessionsMap[s.booking_id] = s;
        });
        setSessions(sessionsMap);
      }
    }

    setLoading(false);
  };

  const submitFeedback = async () => {
    if (!feedbackBookingId || !user) return;

    setSubmittingFeedback(true);

    // Check if session exists
    const existingSession = sessions[feedbackBookingId];

    if (existingSession) {
      // Update existing session
      const { error } = await supabase
        .from("sessions")
        .update({
          student_rating: feedbackRating,
          student_feedback: feedbackText,
        })
        .eq("id", existingSession.id);

      if (error) {
        console.error("Error updating feedback:", error);
        toast({
          title: "Error",
          description: "Failed to submit feedback.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Thank you for your feedback!",
        });
        setSessions({
          ...sessions,
          [feedbackBookingId]: {
            ...existingSession,
            student_rating: feedbackRating,
            student_feedback: feedbackText,
          },
        });
      }
    } else {
      // Create new session with feedback
      const { data: newSession, error } = await supabase
        .from("sessions")
        .insert({
          booking_id: feedbackBookingId,
          student_rating: feedbackRating,
          student_feedback: feedbackText,
          ended_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating session:", error);
        toast({
          title: "Error",
          description: "Failed to submit feedback.",
          variant: "destructive",
        });
      } else if (newSession) {
        toast({
          title: "Success",
          description: "Thank you for your feedback!",
        });
        setSessions({
          ...sessions,
          [feedbackBookingId]: newSession,
        });
      }
    }

    setSubmittingFeedback(false);
    setFeedbackBookingId(null);
    setFeedbackRating(5);
    setFeedbackText("");
  };

  const upcomingBookings = bookings.filter(
    b => isFuture(new Date(b.scheduled_at)) && b.status !== "cancelled"
  );
  
  const pastBookings = bookings.filter(
    b => isPast(new Date(b.scheduled_at)) || b.status === "completed"
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      confirmed: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isStudent) {
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
              <h1 className="text-xl font-bold text-foreground">Student Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your sessions and bookings</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-8">
          {/* Stats Overview */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{upcomingBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pastBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Completed Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {Object.values(sessions).filter(s => s.student_rating).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Reviews Given</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Your scheduled tutoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming sessions. Browse tutors to book your first session!
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {booking.subject}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            with {booking.tutor_profile?.full_name || "Tutor"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {format(new Date(booking.scheduled_at), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {format(new Date(booking.scheduled_at), "h:mm a")} ({booking.duration_minutes} min)
                          </span>
                        </div>
                        <div className="mt-2">{getStatusBadge(booking.status || "pending")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Past Sessions
              </CardTitle>
              <CardDescription>Review your completed sessions and leave feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {pastBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No past sessions yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((booking) => {
                    const session = sessions[booking.id];
                    const hasFeedback = session?.student_rating;

                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-secondary/10 rounded-full">
                            <User className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {booking.subject}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              with {booking.tutor_profile?.full_name || "Tutor"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(booking.scheduled_at), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {hasFeedback ? (
                            <div className="flex items-center gap-1 text-primary">
                              {[...Array(session.student_rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          ) : (
                            <Dialog
                              open={feedbackBookingId === booking.id}
                              onOpenChange={(open) => {
                                if (open) {
                                  setFeedbackBookingId(booking.id);
                                } else {
                                  setFeedbackBookingId(null);
                                  setFeedbackRating(5);
                                  setFeedbackText("");
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Leave Feedback
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Rate Your Session</DialogTitle>
                                  <DialogDescription>
                                    How was your {booking.subject} session with{" "}
                                    {booking.tutor_profile?.full_name || "your tutor"}?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Rating</label>
                                    <div className="flex gap-2">
                                      {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                          key={rating}
                                          onClick={() => setFeedbackRating(rating)}
                                          className="p-1 transition-transform hover:scale-110"
                                        >
                                          <Star
                                            className={`w-8 h-8 ${
                                              rating <= feedbackRating
                                                ? "text-primary fill-current"
                                                : "text-muted-foreground"
                                            }`}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Feedback (optional)</label>
                                    <Textarea
                                      placeholder="Share your experience..."
                                      value={feedbackText}
                                      onChange={(e) => setFeedbackText(e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                  <Button
                                    onClick={submitFeedback}
                                    disabled={submittingFeedback}
                                    className="w-full btn-primary"
                                  >
                                    {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
