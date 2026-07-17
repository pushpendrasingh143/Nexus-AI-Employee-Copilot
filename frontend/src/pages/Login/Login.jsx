import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import api from "../../api/axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem(
      "nexus_remembered_email"
    );

    if (savedEmail) {
      setForm((currentForm) => ({
        ...currentForm,
        email: savedEmail,
      }));

      setRememberEmail(true);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data?.data?.token;
      const user = response.data?.data?.user;

      if (!token || !user) {
        throw new Error(
          "Invalid login response received from server."
        );
      }

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      if (rememberEmail) {
        localStorage.setItem(
          "nexus_remembered_email",
          email
        );
      } else {
        localStorage.removeItem(
          "nexus_remembered_email"
        );
      }

      const previousLocation = location.state?.from;

      const previousPath =
        previousLocation?.pathname &&
        previousLocation.pathname.startsWith("/")
          ? `${previousLocation.pathname}${
              previousLocation.search || ""
            }${previousLocation.hash || ""}`
          : "/dashboard";

      navigate(previousPath, {
        replace: true,
      });
    } catch (requestError) {
      console.error("Login error:", requestError);

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div
        className="login-background login-background-one"
        aria-hidden="true"
      />

      <div
        className="login-background login-background-two"
        aria-hidden="true"
      />

      <main className="login-shell">
        {/* Product branding */}
        <section className="login-brand-panel">
          <div className="login-brand-decoration" />

          <div className="login-brand-header">
            <div className="login-logo">
              <span>N</span>
            </div>

            <div>
              <h1>Nexus AI</h1>
              <p>Employee Copilot</p>
            </div>
          </div>

          <div className="login-live-badge">
            <span className="login-live-dot" />
            Live MVP
          </div>

          <div className="login-brand-content">
            <span className="login-eyebrow">
              AI-powered workplace platform
            </span>

            <h2>
              Turn company knowledge into instant employee
              support.
            </h2>

            <p>
              Manage employees, upload documents, search
              organizational knowledge and automate workplace
              tasks from one secure platform.
            </p>
          </div>

          <div className="login-feature-grid">
            <div className="login-feature">
              <div className="login-feature-icon">01</div>

              <div>
                <strong>Knowledge Search</strong>

                <span>
                  Ask questions from uploaded company PDFs.
                </span>
              </div>
            </div>

            <div className="login-feature">
              <div className="login-feature-icon">02</div>

              <div>
                <strong>AI Agents</strong>

                <span>
                  Automate HR, email, meetings and reports.
                </span>
              </div>
            </div>

            <div className="login-feature">
              <div className="login-feature-icon">03</div>

              <div>
                <strong>Secure Workspace</strong>

                <span>
                  Role-based employee and department
                  management.
                </span>
              </div>
            </div>
          </div>

          <div className="login-brand-footer">
            <span>React</span>
            <span>Express</span>
            <span>PostgreSQL</span>
            <span>Gemini AI</span>
          </div>
        </section>

        {/* Login form */}
        <section className="login-form-panel">
          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="login-mobile-logo">
              <div className="login-logo">
                <span>N</span>
              </div>

              <div>
                <strong>Nexus AI</strong>
                <span>Employee Copilot</span>
              </div>
            </div>

            <div className="login-form-heading">
              <span className="login-welcome-label">
                Welcome back
              </span>

              <h2>Sign in to your workspace</h2>

              <p>
                Enter your registered Nexus AI account details
                to continue.
              </p>
            </div>

            {error && (
              <div
                className="login-error"
                role="alert"
              >
                <span className="login-error-icon">
                  !
                </span>

                <div>
                  <strong>Unable to sign in</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="login-field">
              <label htmlFor="login-email">
                Email address
              </label>

              <div className="login-input-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="login-input-icon"
                >
                  <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm8 7 8-5H4l8 5Zm0 2.3L4 9.3V17h16V9.3l-8 5Z" />
                </svg>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">
                Password
              </label>

              <div className="login-input-wrapper">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="login-input-icon"
                >
                  <path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3Zm-7-2a2 2 0 1 1 4 0v2h-4V6Zm2 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
                </svg>

                <input
                  id="login-password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (currentValue) => !currentValue
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24">
                      <path d="m3.3 2 18.7 18.7-1.3 1.3-3.2-3.2A11.7 11.7 0 0 1 12 20C5 20 1 12 1 12a20 20 0 0 1 4.1-5.2L2 3.3 3.3 2Zm3.2 6.2A14.4 14.4 0 0 0 3.3 12c1.2 1.8 4.3 6 8.7 6 1.4 0 2.7-.4 3.8-1L14 15.2a3.5 3.5 0 0 1-4.7-4.7L6.5 8.2ZM12 4c7 0 11 8 11 8a18 18 0 0 1-3.3 4.5l-1.4-1.4a15.5 15.5 0 0 0 2.4-3.1C19.5 10.2 16.4 6 12 6c-.8 0-1.6.1-2.3.4L8.1 4.8A10.8 10.8 0 0 1 12 4Zm0 4.5a3.5 3.5 0 0 1 3.5 3.5v.2L11.8 8.5h.2Z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M12 4c7 0 11 8 11 8s-4 8-11 8S1 12 1 12s4-8 11-8Zm0 2c-4.4 0-7.5 4.2-8.7 6 1.2 1.8 4.3 6 8.7 6s7.5-4.2 8.7-6C19.5 10.2 16.4 6 12 6Zm0 2.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <label className="login-remember">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(event) =>
                  setRememberEmail(event.target.checked)
                }
                disabled={loading}
              />

              <span>Remember my email</span>
            </label>

            <button
              className="login-submit"
              type="submit"
              disabled={
                loading ||
                !form.email.trim() ||
                !form.password
              }
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Nexus AI
                  <span className="login-arrow">
                    →
                  </span>
                </>
              )}
            </button>

            <div className="login-demo-notice">
              <div className="login-demo-icon">
                i
              </div>

              <div>
                <strong>Project demo access</strong>

                <p>
                  Use any account already registered in your
                  Nexus AI Employee Copilot database.
                </p>
              </div>
            </div>

            <div className="login-security">
              <svg viewBox="0 0 24 24">
                <path d="M12 2 4 5v6c0 5.5 3.4 9.5 8 11 4.6-1.5 8-5.5 8-11V5l-8-3Zm0 2.2L18 6.5V11c0 4.3-2.5 7.6-6 8.9-3.5-1.3-6-4.6-6-8.9V6.5l6-2.3Z" />
              </svg>

              Secure authentication powered by JWT
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;