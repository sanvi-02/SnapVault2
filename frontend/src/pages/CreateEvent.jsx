import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const CreateEvent = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    category: "Sports",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/events", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    background: "#1a1a2e",
    border: "1.5px solid #2a2a3e",
    borderRadius: "12px",
    padding: "13px 16px",
    color: "#e0d9ff",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "Georgia, serif",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: "8px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#a78bfa";
    e.target.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.15)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "#2a2a3e";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        fontFamily: "Georgia, serif",
      }}>
      <Navbar />

      <div
        style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#f0eeff",
              marginBottom: "8px",
            }}>
            Create Event
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "15px" }}>
            Fill in the details to create a new event album
          </p>
        </div>

        <div
          style={{
            background: "#13131f",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 8px 40px rgba(167,139,250,0.1)",
            border: "1px solid #2a2a3e",
            position: "relative",
          }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              width: "80%",
              height: "3px",
              background: "linear-gradient(90deg, #a78bfa, #f9a8d4)",
              borderRadius: "0 0 4px 4px",
            }}
          />

          {error && (
            <div
              style={{
                background: "#1f1010",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "24px",
                color: "#ef4444",
                fontSize: "14px",
                textAlign: "center",
              }}>
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Event Name</label>
              <input
                type="text"
                placeholder="e.g. Annual Sports Day"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                placeholder="Describe the event..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  lineHeight: "1.6",
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                style={{ ...inputStyle, colorScheme: "dark" }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  colorScheme: "dark",
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}>
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Technical">Technical</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "1.5px solid #2a2a3e",
                  borderRadius: "12px",
                  padding: "14px",
                  fontSize: "15px",
                  color: "#6b7280",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#a78bfa";
                  e.target.style.color = "#a78bfa";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#2a2a3e";
                  e.target.style.color = "#6b7280";
                }}>
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 2,
                  background: "linear-gradient(135deg, #a78bfa, #f9a8d4)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 6px 20px rgba(167,139,250,0.4)",
                  transition: "all 0.2s",
                  opacity: loading ? 0.75 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}>
                {loading ? "Creating..." : "Create Event →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
