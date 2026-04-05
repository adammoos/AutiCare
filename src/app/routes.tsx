import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { LandingPage } from "./components/pages/LandingPage";
import { LoginPage } from "./components/pages/LoginPage";
import { SignupPage } from "./components/pages/SignupPage";
import { ParentDashboard } from "./components/pages/parent/ParentDashboard";
import { ParentProgram } from "./components/pages/parent/ParentProgram";
import { ParentGames } from "./components/pages/parent/ParentGames";
import { ParentMarketplace } from "./components/pages/parent/ParentMarketplace";
import { ParentTherapyRequest } from "./components/pages/parent/ParentTherapyRequest";
import { ParentRequestTracking } from "./components/pages/parent/ParentRequestTracking";
import { ParentDoctorProfile } from "./components/pages/parent/ParentDoctorProfile";
import { ParentProgress } from "./components/pages/parent/ParentProgress";
import { ParentNotifications } from "./components/pages/parent/ParentNotifications";
import { ParentConference } from "./components/pages/parent/ParentConference";
import { ParentTraining } from "./components/pages/parent/ParentTraining";
import { ProfessionalDashboard } from "./components/pages/professional/ProfessionalDashboard";
import { ProfessionalServices } from "./components/pages/professional/ProfessionalServices";
import { ProfessionalRequests } from "./components/pages/professional/ProfessionalRequests";
import { ProfessionalProfile } from "./components/pages/professional/ProfessionalProfile";
import { ProfessionalNotifications } from "./components/pages/professional/ProfessionalNotifications";
import { EmotionRecognitionGame } from "./components/games/EmotionRecognitionGame";
import { MemoryGame } from "./components/games/MemoryGame";
import { ConcentrationGame } from "./components/games/ConcentrationGame";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignupPage },
      
      // Parent routes
      { path: "parent/dashboard", Component: ParentDashboard },
      { path: "parent/program", Component: ParentProgram },
      { path: "parent/games", Component: ParentGames },
      { path: "parent/games/emotion-recognition", Component: EmotionRecognitionGame },
      { path: "parent/games/memory", Component: MemoryGame },
      { path: "parent/games/concentration", Component: ConcentrationGame },
      { path: "parent/marketplace", Component: ParentMarketplace },
      { path: "parent/marketplace/doctor/:doctorId", Component: ParentDoctorProfile },
      { path: "parent/therapy-request", Component: ParentTherapyRequest },
      { path: "parent/requests", Component: ParentRequestTracking },
      { path: "parent/progress", Component: ParentProgress },
      { path: "parent/notifications", Component: ParentNotifications },
      { path: "parent/conference", Component: ParentConference },
      { path: "parent/training", Component: ParentTraining },
      
      // Professional routes
      { path: "professional/dashboard", Component: ProfessionalDashboard },
      { path: "professional/services", Component: ProfessionalServices },
      { path: "professional/requests", Component: ProfessionalRequests },
      { path: "professional/profile", Component: ProfessionalProfile },
      { path: "professional/notifications", Component: ProfessionalNotifications },
      
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
