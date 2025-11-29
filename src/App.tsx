import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProvidersProvider } from "./context/ProvidersContext";
import { BookingsProvider } from "./context/BookingsContext";
import { HomePage } from "./pages/HomePage";
import { ProviderPage } from "./pages/ProviderPage";
import { SignInPage, SignUpPage, ProfilePage } from "./pages/AuthPages";
import { SymptomHelperPage } from "./pages/SymptomHelperPage";
import { MyAppointmentsPage } from "./pages/MyAppointmentsPage";
import { ProviderPanelPage } from "./pages/ProviderPanelPage";
import "./styles/global.css";

/**
 * DoctorGo Application
 * Healthcare provider discovery and appointment booking platform
 */
function App() {
  return (
    <AuthProvider>
      <ProvidersProvider>
        <BookingsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/provider/:id" element={<ProviderPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/symptom-helper" element={<SymptomHelperPage />} />
              <Route path="/my-appointments" element={<MyAppointmentsPage />} />
              <Route path="/provider-panel" element={<ProviderPanelPage />} />
            </Routes>
          </BrowserRouter>
        </BookingsProvider>
      </ProvidersProvider>
    </AuthProvider>
  );
}

export default App;
