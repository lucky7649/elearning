import { useEffect, useState } from "react";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, CheckCircle, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
  useGenerateQuizMutation,
} from "@/api/courseApi";

const MEDIA_API = "/api/v1/media";

const LectureTab = () => {
  const { id: courseId, lectureId } = useParams();
  const navigate = useNavigate();

  /* ---------------- FETCH ---------------- */
  const { data } = useGetLectureByIdQuery(lectureId);
  const lecture = data?.lecture;

  /* ---------------- STATE ---------------- */
  const [title, setTitle] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);

  const [notesFile, setNotesFile] = useState(null);
  const [notesTitle, setNotesTitle] = useState("");

  const [assignmentFile, setAssignmentFile] = useState(null);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState("");

  // 🧠 QUIZ STATE
  const [quizParagraph, setQuizParagraph] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState([]);
  const [savedQuiz, setSavedQuiz] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (!lecture) return;

    setTitle(lecture.lectureTitle || "");
    setIsFree(lecture.isPreviewFree || false);
    setSavedQuiz(lecture.quiz || []);

    if (lecture.videoUrl) {
      setVideoInfo({
        videoUrl: lecture.videoUrl,
        publicId: lecture.publicId,
      });
    }
  }, [lecture]);

  /* ---------------- API ---------------- */
  const [editLecture, { isLoading }] = useEditLectureMutation();
  const [removeLecture, { isLoading: removing }] = useRemoveLectureMutation();
  const [generateQuizApi, { isLoading: generatingQuiz }] = useGenerateQuizMutation();

  /* ---------------- VIDEO UPLOAD ---------------- */
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Invalid file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setProgress(0);

    try {
      const res = await axios.post(
        `${MEDIA_API}/upload-video`,
        formData,
        {
          onUploadProgress: (event) => {
            const percent = Math.floor(
              (event.loaded * 100) / event.total
            );
            setProgress(percent);
          },
        }
      );

      const data = res?.data?.data || res?.data;

      setVideoInfo({
        videoUrl: data.url,
        publicId: data.public_id,
      });

      toast.success("Video uploaded");

    } catch (err) {
      console.log(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- UPDATE ---------------- */
  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error("Title required");
      return;
    }

    if (!videoInfo) {
      toast.error("Upload video first");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("lectureTitle", title);
      formData.append("isPreviewFree", isFree);

      formData.append("videoUrl", videoInfo.videoUrl);
      formData.append("publicId", videoInfo.publicId);

      // NOTES
      if (notesFile) {
        formData.append("notes", notesFile);
        formData.append("notesTitle", notesTitle);
      }

      // ASSIGNMENT
      if (assignmentFile) {
        formData.append("assignment", assignmentFile);
        formData.append("assignmentTitle", assignmentTitle);
        formData.append("assignmentDesc", assignmentDesc);
      }

      // QUIZ - send saved quiz
      if (savedQuiz.length > 0) {
        formData.append("quiz", JSON.stringify(savedQuiz));
      }

      const res = await editLecture({
        courseId,
        lectureId,
        data: formData,
      }).unwrap();

      toast.success(res?.message || "Lecture updated");

    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  /* ---------------- QUIZ GENERATION ---------------- */
  const handleGenerateQuiz = async () => {
    if (!quizParagraph.trim()) {
      toast.error("Please enter a paragraph about the lecture first.");
      return;
    }
    try {
      const res = await generateQuizApi({ courseId, lectureId, paragraph: quizParagraph }).unwrap();
      setGeneratedQuiz(res.quiz);
      toast.success("Quiz generated! Review and save it.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to generate quiz");
    }
  };

  const handleSaveGeneratedQuiz = async () => {
    const quizToSave = generatedQuiz;
    try {
      // Immediately persist quiz to DB without requiring Update Lecture click
      const formData = new FormData();
      formData.append("lectureTitle", title || lecture?.lectureTitle || "");
      formData.append("isPreviewFree", isFree);
      if (videoInfo?.videoUrl) formData.append("videoUrl", videoInfo.videoUrl);
      if (videoInfo?.publicId) formData.append("publicId", videoInfo.publicId);
      formData.append("quiz", JSON.stringify(quizToSave));

      await editLecture({ courseId, lectureId, data: formData }).unwrap();

      setSavedQuiz(quizToSave);
      setGeneratedQuiz([]);
      setQuizParagraph("");
      toast.success("✅ Quiz saved to database successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save quiz. Please try again.");
    }
  };

  const handleDiscardQuiz = () => {
    setGeneratedQuiz([]);
    toast.info("Quiz discarded.");
  };

  const handleRemoveQuiz = async () => {
    try {
      const formData = new FormData();
      formData.append("lectureTitle", title || lecture?.lectureTitle || "");
      formData.append("isPreviewFree", isFree);
      if (videoInfo?.videoUrl) formData.append("videoUrl", videoInfo.videoUrl);
      if (videoInfo?.publicId) formData.append("publicId", videoInfo.publicId);
      formData.append("quiz", JSON.stringify([]));

      await editLecture({ courseId, lectureId, data: formData }).unwrap();
      setSavedQuiz([]);
      toast.success("Quiz removed.");
    } catch (err) {
      toast.error("Failed to remove quiz.");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    if (!window.confirm("Delete lecture?")) return;

    try {
      await removeLecture(lectureId).unwrap();
      toast.success("Lecture deleted");

      navigate(`/admin/course/${courseId}/lecture`);
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription>
            Update lecture details
          </CardDescription>
        </div>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={removing}
        >
          {removing ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Remove Lecture"
          )}
        </Button>
      </CardHeader>

      <CardContent>

        {/* TITLE */}
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* VIDEO */}
        <div className="my-5">
          <Label>Video Upload</Label>
          <Input
            type="file"
            accept="video/*"
            onChange={handleUpload}
          />
        </div>

        {/* NOTES */}
        <div className="my-5">
          <Label>Notes (PDF)</Label>
          <Input
            type="file"
            onChange={(e) => setNotesFile(e.target.files[0])}
          />
          <Input
            placeholder="Notes Title"
            value={notesTitle}
            onChange={(e) => setNotesTitle(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* ASSIGNMENT */}
        <div className="my-5">
          <Label>Assignment</Label>
          <Input
            type="file"
            onChange={(e) =>
              setAssignmentFile(e.target.files[0])
            }
          />

          <Input
            placeholder="Assignment Title"
            value={assignmentTitle}
            onChange={(e) =>
              setAssignmentTitle(e.target.value)
            }
            className="mt-2"
          />

          <Input
            placeholder="Assignment Description"
            value={assignmentDesc}
            onChange={(e) =>
              setAssignmentDesc(e.target.value)
            }
            className="mt-2"
          />
        </div>

        {/* FREE */}
        <div className="flex items-center space-x-2 my-5">
          <Switch checked={isFree} onCheckedChange={setIsFree} />
          <Label>Free Preview</Label>
        </div>

        {/* ===================== AI QUIZ GENERATOR ===================== */}
        <div className="my-6 border border-dashed border-purple-400 rounded-xl p-5 bg-purple-50 dark:bg-purple-950/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-purple-500" size={20} />
            <Label className="text-purple-700 dark:text-purple-300 font-semibold text-base">
              AI Quiz Generator
            </Label>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Paste a paragraph about this lecture. AI will generate 3 multiple-choice questions for the student to answer before unlocking the next lecture.
          </p>
          <Textarea
            placeholder="e.g. This lecture covers the basics of React hooks, including useState and useEffect. useState allows functional components to hold state. useEffect runs side effects after rendering..."
            value={quizParagraph}
            onChange={(e) => setQuizParagraph(e.target.value)}
            rows={4}
            className="mb-3"
          />
          <Button
            type="button"
            variant="outline"
            className="border-purple-500 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 flex items-center gap-2"
            onClick={handleGenerateQuiz}
            disabled={generatingQuiz}
          >
            {generatingQuiz ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate Quiz</>
            )}
          </Button>

          {/* AI GENERATED QUESTIONS PREVIEW */}
          {generatedQuiz.length > 0 && (
            <div className="mt-5">
              <p className="font-semibold mb-3 text-sm text-purple-700 dark:text-purple-300">
                Review Generated Questions ({generatedQuiz.length}):
              </p>
              <div className="flex flex-col gap-4">
                {generatedQuiz.map((q, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-4">
                    <p className="font-medium mb-2 text-sm">Q{i + 1}. {q.question}</p>
                    <ul className="space-y-1">
                      {q.options.map((opt, j) => (
                        <li key={j} className={`text-sm px-3 py-1 rounded ${j === q.correctAnswerIndex ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-semibold" : "text-muted-foreground"}`}>
                          {j === q.correctAnswerIndex ? "✅ " : `${String.fromCharCode(65 + j)}. `}{opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <Button type="button" onClick={handleSaveGeneratedQuiz} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="w-4 h-4" /> Approve & Save Quiz
                </Button>
                <Button type="button" variant="destructive" onClick={handleDiscardQuiz} className="flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Discard
                </Button>
              </div>
            </div>
          )}

          {/* EXISTING SAVED QUIZ */}
          {savedQuiz.length > 0 && generatedQuiz.length === 0 && (
            <div className="mt-5">
              <p className="font-semibold text-sm text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {savedQuiz.length} Quiz Questions Saved to Database
              </p>
              <div className="flex flex-col gap-4">
                {savedQuiz.map((q, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-4 text-sm">
                    <p className="font-semibold mb-2">Q{i + 1}. {q.question}</p>
                    <ul className="space-y-1">
                      {q.options?.map((opt, j) => (
                        <li key={j} className={`px-3 py-1 rounded text-xs ${j === q.correctAnswerIndex ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-semibold" : "text-muted-foreground"}`}>
                          {j === q.correctAnswerIndex ? "✅ " : `${String.fromCharCode(65 + j)}. `}{opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Button type="button" variant="ghost" size="sm" className="mt-3 text-red-500 hover:text-red-600" onClick={handleRemoveQuiz}>
                🗑 Remove Quiz from Database
              </Button>
            </div>
          )}
        </div>

        {/* PROGRESS */}
        {uploading && (
          <div className="my-4">
            <Progress value={progress} />
            <p>{progress}% uploading...</p>
          </div>
        )}

        {/* VIDEO PREVIEW */}
        {videoInfo?.videoUrl && (
          <video
            src={videoInfo.videoUrl}
            controls
            className="w-64 mt-3"
          />
        )}

        {/* BUTTON */}
        <Button
          className="mt-5"
          onClick={handleUpdate}
          disabled={isLoading || uploading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Update Lecture"
          )}
        </Button>

      </CardContent>
    </Card>
  );
};

export default LectureTab;
