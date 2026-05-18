import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useGetCourseProgressQuery, useSubmitQuizMutation } from "@/api/courseProgressApi";
import { useSendHeartbeatMutation } from "@/api/courseApi";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, FileText, Download, PlayCircle,
  Lock, CheckCircle2, Loader2, HelpCircle, BookOpen, Menu, X
} from "lucide-react";
import { toast } from "sonner";

const getDownloadUrl = (url) => {
  if (!url) return "";
  // Force download flag for Cloudinary files
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/fl_attachment/");
  }
  return url;
};

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data: progressData, isLoading, refetch: refetchProgress } = useGetCourseProgressQuery(courseId);
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  const [sendHeartbeat] = useSendHeartbeatMutation();

  useEffect(() => {
    if (!courseId) return;

    // Send initial heartbeat
    sendHeartbeat(courseId).catch(() => {});

    // Send heartbeat every 10 seconds
    const timer = setInterval(() => {
      sendHeartbeat(courseId).catch(() => {});
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, [courseId, sendHeartbeat]);

  const course = progressData?.data?.courseDetails;
  const progress = progressData?.data?.progress || [];

  const [currentLecture, setCurrentLecture] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  const lectures = course?.lectures || [];
  const lecture = lectures[currentLecture];
  const currentVideo = lecture?.videoInfo?.videoUrl || lecture?.videoUrl;

  const isLectureUnlocked = (index) => {
    if (index === 0) return true;
    const prevLecture = lectures[index - 1];
    if (!prevLecture) return false;
    if (!prevLecture.quiz || prevLecture.quiz.length === 0) return true;
    const prevProgress = progress.find((p) => p.lectureId === prevLecture._id?.toString());
    return prevProgress?.quizPassed === true;
  };

  const handleLectureSelect = (index) => {
    if (!isLectureUnlocked(index)) {
      toast.warning("Complete the quiz for the previous lecture to unlock this one!");
      return;
    }
    setCurrentLecture(index);
    setSelectedAnswers({});
    setQuizResult(null);
    setSidebarOpen(false);
  };

  const handleSubmitQuiz = async () => {
    if (!lecture?.quiz) return;
    const answersArray = lecture.quiz.map((_, i) =>
      selectedAnswers[i] !== undefined ? Number(selectedAnswers[i]) : -1
    );
    if (answersArray.includes(-1)) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    try {
      const res = await submitQuiz({ courseId, lectureId: lecture._id, answers: answersArray }).unwrap();
      setQuizResult(res);
      if (res.passed) { toast.success(res.message); refetchProgress(); }
      else toast.error(res.message);
    } catch (err) {
      toast.error("Failed to submit quiz.");
    }
  };

  const hasQuiz = Array.isArray(lecture?.quiz) && lecture.quiz.length > 0;
  const currentProgress = progress.find((p) => p.lectureId === lecture?._id?.toString());
  const alreadyPassed = currentProgress?.quizPassed === true;

  // Lecture list shared between mobile drawer and desktop sidebar
  const LectureList = () => (
    <div className="flex flex-col gap-2">
      {lectures.map((lec, index) => {
        const unlocked = isLectureUnlocked(index);
        const isActive = currentLecture === index;
        const lecProgress = progress.find((p) => p.lectureId === lec._id?.toString());
        const passed = lecProgress?.quizPassed;

        return (
          <div
            key={lec._id}
            onClick={() => handleLectureSelect(index)}
            className={`p-3 flex items-center gap-3 rounded-xl transition-all border text-sm
              ${isActive
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : unlocked
                ? "bg-card text-card-foreground border-border hover:bg-accent cursor-pointer"
                : "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-60"
              }`}
          >
            {unlocked ? (
              passed ? (
                <CheckCircle2 size={16} className={isActive ? "text-primary-foreground shrink-0" : "text-green-500 shrink-0"} />
              ) : (
                <PlayCircle size={16} className={isActive ? "text-primary-foreground shrink-0" : "text-muted-foreground shrink-0"} />
              )
            ) : (
              <Lock size={16} className="text-muted-foreground shrink-0" />
            )}
            <span className="font-medium line-clamp-2 leading-snug">{lec.lectureTitle}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground relative">
      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-[80vw] max-w-xs bg-background border-l border-border p-5 overflow-y-auto z-50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base flex items-center gap-2"><BookOpen size={18} /> Course Content</h2>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            <LectureList />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-6 flex flex-col gap-5 overflow-y-auto min-w-0">
        {/* TOP BAR */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2 shrink-0">
            <ArrowLeft size={16} /> Back
          </Button>
          <h1 className="text-base md:text-xl font-bold truncate flex-1 min-w-0">{course?.courseTitle}</h1>
          {/* Mobile sidebar toggle */}
          <Button variant="outline" size="sm" className="md:hidden flex items-center gap-2 shrink-0" onClick={() => setSidebarOpen(true)}>
            <Menu size={16} /> Lectures
          </Button>
        </div>

        {/* VIDEO */}
        <div className="w-full bg-black rounded-xl overflow-hidden shadow-lg border border-border">
          <div style={{ aspectRatio: "16/9" }}>
            <ReactPlayer url={currentVideo} controls width="100%" height="100%" />
          </div>
        </div>

        <h2 className="text-lg md:text-2xl font-semibold">{lecture?.lectureTitle}</h2>

        {/* NOTES & ASSIGNMENTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lecture?.notes?.fileUrl && (
            <div className="bg-card text-card-foreground border border-border p-4 rounded-xl shadow-sm flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-500 shrink-0" size={18} />
                <h3 className="font-semibold text-sm line-clamp-1">{lecture?.notes?.title || "Lecture Notes"}</h3>
              </div>
              <p className="text-muted-foreground text-xs">Supplementary notes for this lecture.</p>
              <Button asChild variant="outline" size="sm" className="w-full flex items-center gap-2">
                <a href={getDownloadUrl(lecture.notes.fileUrl)} download target="_blank" rel="noreferrer">
                  <Download size={14} /> Download PDF
                </a>
              </Button>
            </div>
          )}
          {lecture?.assignment?.fileUrl && (
            <div className="bg-card text-card-foreground border border-border p-4 rounded-xl shadow-sm flex flex-col justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="text-purple-500 shrink-0" size={18} />
                <h3 className="font-semibold text-sm line-clamp-1">{lecture?.assignment?.title || "Assignment"}</h3>
              </div>
              <p className="text-muted-foreground text-xs line-clamp-2">{lecture?.assignment?.description || "Complete the assignment for this module."}</p>
              <Button asChild variant="default" size="sm" className="w-full flex items-center gap-2">
                <a href={getDownloadUrl(lecture.assignment.fileUrl)} download target="_blank" rel="noreferrer">
                  <Download size={14} /> Get Assignment
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* QUIZ */}
        {hasQuiz ? (
          <div className="border border-dashed border-orange-400 rounded-xl p-4 md:p-6 bg-orange-50 dark:bg-orange-950/20">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={20} className={alreadyPassed ? "text-green-500" : "text-orange-500"} />
              <h3 className="font-bold text-base">{alreadyPassed ? "Quiz Completed ✅" : "Lecture Quiz — Pass to unlock next lecture"}</h3>
            </div>
            {alreadyPassed ? (
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">You've passed this quiz. The next lecture is unlocked!</p>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                  {lecture.quiz.map((q, qi) => (
                    <div key={qi} className="bg-card border border-border rounded-xl p-4">
                      <p className="font-semibold mb-3 text-sm">Q{qi + 1}. {q.question}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map((opt, oi) => (
                          <label
                            key={oi}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer border transition-all text-sm
                              ${selectedAnswers[qi] === oi ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border hover:bg-accent"}`}
                          >
                            <input
                              type="radio"
                              name={`question-${qi}`}
                              value={oi}
                              checked={selectedAnswers[qi] === oi}
                              onChange={() => setSelectedAnswers((prev) => ({ ...prev, [qi]: oi }))}
                              className="accent-primary"
                            />
                            <span>{String.fromCharCode(65 + oi)}. {opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {quizResult && !quizResult.passed && (
                  <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 rounded-lg text-red-700 dark:text-red-300 font-medium text-sm">
                    ❌ {quizResult.message} — Please try again.
                  </div>
                )}
                <Button className="mt-4 w-full sm:w-auto" onClick={handleSubmitQuiz} disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Quiz"}
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="border border-dashed border-muted-foreground/30 rounded-xl p-4 bg-muted/20 flex items-center gap-3 text-muted-foreground text-sm">
            <HelpCircle size={18} />
            <span>No quiz has been added to this lecture yet.</span>
          </div>
        )}
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex md:w-72 lg:w-80 bg-muted/30 border-l border-border flex-col overflow-y-auto shadow-inner">
        <div className="p-5 border-b border-border">
          <h2 className="font-bold text-base flex items-center gap-2"><BookOpen size={18} /> Course Content</h2>
          <p className="text-xs text-muted-foreground mt-1">{lectures.length} lectures</p>
        </div>
        <div className="p-4">
          <LectureList />
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
