import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/landingPage";
import ProtectedRoute from "./routes/protectedRoute";
import TeacherDashboard from "./components/teacherDashboard";
import StudentFeedback from "./components/studentFeedback";
import ActivityInfo from "./components/activityInfo";

import Login from "./components/login";
import RegisterTeacher from "./components/RegisterTeacher";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/professor/login" element={<Login />} />
        <Route path="/professor/register" element={<RegisterTeacher />} />
        <Route path="/student/:accessCode" element={<StudentFeedback />} />

        <Route
          path="/professor/dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
            path="/professor/activity/:id"
            element={
                <ProtectedRoute>
                <ActivityInfo />
                </ProtectedRoute>
            }
            />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
