import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useGetCourseProgressQuery, useSubmitQuizMutation } from "@/api/courseProgressApi";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, FileText, Download, PlayCircle,
  Lock, CheckCircle2, Loader2, HelpCircle
} from "lucide-react";
import { toast } from "sonner";

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Single source of truth: courseProgress endpoint returns BOTH courseDetails AND progress
  const { data: progressData, isLoading, refetch: refetchProgress } = useGetCourseProgressQuery(courseId);
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();

  const course = progressData?.data?.courseDetails;
  const progress = progressData?.data?.progress || [];

  const [currentLecture, setCurrentLecture] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

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

  // Debug: log lecture data to check quiz field
  console.log("📚 Current Lecture:", lecture);
  console.log("🧠 Quiz:", lecture?.quiz);
  console.log("📊 Progress:", progress);

  // ---- Helper: Is a lecture unlocked? ----
  const isLectureUnlocked = (index) => {
    if (index === 0) return true;
    const prevLecture = lectures[index - 1];
    if (!prevLecture) return false;
    // If previous lecture has no quiz, it's automatically unlocked
    if (!prevLecture.quiz || prevLecture.quiz.length === 0) return true;
    const prevProgress = progress.find(
      (p) => p.lectureId === prevLecture._id?.toString()
    );
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
  };

  // ---- Quiz submit ----
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
      const res = await submitQuiz({
        courseId,
        lectureId: lecture._id,
        answers: answersArray,
      }).unwrap();

      setQuizResult(res);
      if (res.passed) {
        toast.success(res.message);
        refetchProgress();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Failed to submit quiz.");
    }
  };

  const hasQuiz = Array.isArray(lecture?.quiz) && lecture.quiz.length > 0;
  const currentProgress = progress.find(
    (p) => p.lectureId === lecture?._id?.toString()
  );
  const alreadyPassed = currentProgress?.quizPassed === true;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      {/* 🎥 VIDEO PLAYER & CONTENT */}
      <div className="flex-1 p-4 md:p-8 flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
          <h1 className="text-xl md:text-2xl font-bold truncate ml-4">{course?.courseTitle}</h1>
        </div>

        <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg border border-border">
          <ReactPlayer
            url={currentVideo}
            controls
            width="100%"
            height="100%"
            style={{ aspectRatio: "16/9" }}
          />
        </div>

        <h2 className="text-2xl font-semibold mt-2">{lecture?.lectureTitle}</h2>

        {/* NOTES & ASSIGNMENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lecture?.notes?.fileUrl && (
            <div className="bg-card text-card-foreground border border-border p-5 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="text-blue-500" size={20} />
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {lecture?.notes?.title || "Lecture Notes"}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">Download the supplementary notes for this lecture.</p>
              </div>
              <Button asChild variant="outline" className="w-full flex items-center gap-2">
                <a href={lecture.notes.fileUrl} target="_blank" rel="noreferrer">
                  <Download size={16} /> Download PDF
                </a>
              </Button>
            </div>
          )}

          {lecture?.assignment?.fileUrl && (
            <div className="bg-card text-card-foreground border border-border p-5 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="text-purple-500" size={20} />
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {lecture?.assignment?.title || "Assignment"}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {lecture?.assignment?.description || "Complete the assignment for this module."}
                </p>
              </div>
              <Button asChild variant="default" className="w-full flex items-center gap-2">
                <a href={lecture.assignment.fileUrl} target="_blank" rel="noreferrer">
                  <Download size={16} /> Get Assignment
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* ===================== QUIZ SECTION ===================== */}
        {hasQuiz ? (
          <div className="mt-2 border border-dashed border-orange-400 rounded-xl p-6 bg-orange-50 dark:bg-orange-950/20">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2
                size={22}
                className={alreadyPassed ? "text-green-500" : "text-orange-500"}
              />
              <h3 className="font-bold text-lg">
                {alreadyPassed
                  ? "Quiz Completed ✅"
                  : "Lecture Quiz — Pass to unlock next lecture"}
              </h3>
            </div>

            {alreadyPassed ? (
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                You have already passed the quiz for this lecture. The next lecture is unlocked!
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-6">
                  {lecture.quiz.map((q, qi) => (
                    <div key={qi} className="bg-card border border-border rounded-lg p-5">
                      <p className="font-semibold mb-3">
                        Q{qi + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {q.options.map((opt, oi) => (
                          <label
                            key={oi}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer border transition-all
                              ${selectedAnswers[qi] === oi
                                ? "border-primary bg-primary/10 text-primary font-semibold"
                                : "border-border hover:bg-accent"
                              }`}
                          >
                            <input
                              type="radio"
                              name={`question-${qi}`}
                              value={oi}
                              checked={selectedAnswers[qi] === oi}
                              onChange={() =>
                                setSelectedAnswers((prev) => ({ ...prev, [qi]: oi }))
                              }
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
                  <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 rounded-lg text-red-700 dark:text-red-300 font-medium">
                    ❌ {quizResult.message} — Please try again.
                  </div>
                )}

                <Button
                  className="mt-5 w-full md:w-auto"
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                  ) : (
                    "Submit Quiz"
                  )}
                </Button>
              </>
            )}
          </div>
        ) : (
          // Show a message if no quiz has been added by instructor yet
          <div className="mt-2 border border-dashed border-muted-foreground/30 rounded-xl p-5 bg-muted/20 flex items-center gap-3 text-muted-foreground text-sm">
            <HelpCircle size={18} />
            <span>No quiz has been added to this lecture yet.</span>
          </div>
        )}
      </div>

      {/* 📚 LECTURE LIST SIDEBAR */}
      <div className="w-full md:w-80 bg-muted/30 border-l border-border p-6 overflow-y-auto hidden md:block shadow-inner">
        <h2 className="font-bold mb-6 text-xl tracking-tight">Course Content</h2>
        <div className="flex flex-col gap-2">
          {lectures.map((lec, index) => {
            const unlocked = isLectureUnlocked(index);
            const isActive = currentLecture === index;
            const lecProgress = progress.find(
              (p) => p.lectureId === lec._id?.toString()
            );
            const passed = lecProgress?.quizPassed;

            return (
              <div
                key={lec._id}
                onClick={() => handleLectureSelect(index)}
                className={`p-4 flex items-center gap-3 rounded-lg transition-all border
                  ${isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : unlocked
                    ? "bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    : "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-60"
                  }`}
              >
                {unlocked ? (
                  passed ? (
                    <CheckCircle2
                      size={18}
                      className={isActive ? "text-primary-foreground" : "text-green-500"}
                    />
                  ) : (
                    <PlayCircle
                      size={18}
                      className={isActive ? "text-primary-foreground" : "text-muted-foreground"}
                    />
                  )
                ) : (
                  <Lock size={18} className="text-muted-foreground" />
                )}
                <span className="font-medium text-sm line-clamp-2">{lec.lectureTitle}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
