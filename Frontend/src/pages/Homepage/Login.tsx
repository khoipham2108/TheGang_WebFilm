import { useState } from "react";
import SignIn from "../../Componets/LoginpageDesign/SignIn";
import SignUp from "../../Componets/LoginpageDesign/SignUp";
import Header from "../../Componets/MainPageDesign/Header";
import MegaFooter from "../../Componets/HomepageDesign/MegaFooter";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="auth-page">
      {/* BG image like Netflix — bạn thay ảnh ở /public/auth/bg.jpg */}
      <div className="auth-bg" style={{ backgroundImage: `url(BgLogin.jpg)` }} />
      <div className="auth-overlay" />

      {/* <header className="auth-top container">
        <Link to="/"><img src="/Logo.png" alt="The Gangs" style={{ height: 44 }} /></Link>
      </header> */}
      <Header />

      <main className="auth-wrapper">
        {mode === "signin" ? (
          <SignIn onSwitch={() => setMode("signup")} />
        ) : (
          <SignUp onSwitch={() => setMode("signin")} />
        )}
      </main>

      {/* <footer className="auth-footer">
        <div className="container">© {new Date().getFullYear()} The Gangs</div>
      </footer> */}
      <MegaFooter />
    </div>
  );
}
