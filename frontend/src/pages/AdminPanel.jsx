import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "Admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, eventsRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/events"),
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await API.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  const roleColors = {
    Admin: { bg: "#1f1a0e", color: "#fbbf24", border: "#854d0e" },
    Photographer: { bg: "#1a1333", color: "#a78bfa", border: "#3b2d6e" },
    ClubMember: { bg: "#0f1f14", color: "#4ade80", border: "#166534" },
    Viewer: { bg: "#1a1a2e", color: "#9ca3af", border: "#2a2a3e" },
  };

  const categoryColors = {
    Sports: { bg: "#0f1829", color: "#60a5fa" },
    Cultural: { bg: "#1e1228", color: "#c084fc" },
    Technical: { bg: "#0f1f14", color: "#4ade80" },
    Other: { bg: "#1f1308", color: "#fb923c" },
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
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#f0eeff",
              marginBottom: "8px",
            }}>
            Admin Panel
          </h1>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>
            Manage users and events
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "36px",
          }}>
          {[
            {
              label: "Total Users",
              value: users.length,
              icon: "👥",
              color: "#a78bfa",
            },
            {
              label: "Total Events",
              value: events.length,
              icon: "🎉",
              color: "#f9a8d4",
            },
            {
              label: "Photographers",
              value: users.filter((u) => u.role === "Photographer").length,
              icon: "📸",
              color: "#6ee7b7",
            },
            {
              label: "Admins",
              value: users.filter((u) => u.role === "Admin").length,
              icon: "🛡️",
              color: "#fcd34d",
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "#13131f",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #2a2a3e",
              }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: stat.color,
                }}>
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginTop: "4px",
                }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {["users", "events"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 28px",
                borderRadius: "10px",
                border: "none",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                background:
                  activeTab === tab
                    ? "linear-gradient(135deg, #a78bfa, #f9a8d4)"
                    : "#13131f",
                color: activeTab === tab ? "#fff" : "#6b7280",
                boxShadow:
                  activeTab === tab
                    ? "0 4px 12px rgba(167,139,250,0.35)"
                    : "none",
                border: activeTab === tab ? "none" : "1px solid #2a2a3e",
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}>
              {tab === "users" ? "👥 Users" : "🎉 Events"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            background: "#13131f",
            borderRadius: "20px",
            border: "1px solid #2a2a3e",
            overflow: "hidden",
          }}>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px",
                color: "#a78bfa",
              }}>
              Loading...
            </div>
          ) : activeTab === "users" ? (
            /* Users Table */
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#1a1a2e",
                    borderBottom: "1px solid #2a2a3e",
                  }}>
                  {["User", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#6b7280",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const rc = roleColors[u.role] || roleColors.Viewer;
                  return (
                    <tr
                      key={u._id}
                      style={{
                        borderBottom:
                          i < users.length - 1 ? "1px solid #1e1e2e" : "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#1a1a2e")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }>
                      {/* Name */}
                      <td style={{ padding: "16px 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              background:
                                "linear-gradient(135deg, #a78bfa, #f9a8d4)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontWeight: "700",
                              fontSize: "14px",
                            }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span
                            style={{
                              fontWeight: "600",
                              color: "#e0d9ff",
                              fontSize: "14px",
                            }}>
                            {u.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td
                        style={{
                          padding: "16px 20px",
                          color: "#6b7280",
                          fontSize: "14px",
                        }}>
                        {u.email}
                      </td>

                      {/* Role dropdown */}
                      <td style={{ padding: "16px 20px" }}>
                        <select
                          value={u.role}
                          onChange={(e) =>
                            updateUserRole(u._id, e.target.value)
                          }
                          style={{
                            background: rc.bg,
                            color: rc.color,
                            border: `1px solid ${rc.border}`,
                            borderRadius: "6px",
                            padding: "4px 10px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            outline: "none",
                          }}>
                          <option value="Viewer">Viewer</option>
                          <option value="ClubMember">ClubMember</option>
                          <option value="Photographer">Photographer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>

                      {/* Joined */}
                      <td
                        style={{
                          padding: "16px 20px",
                          color: "#4b5563",
                          fontSize: "13px",
                        }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Delete */}
                      <td style={{ padding: "16px 20px" }}>
                        {u._id !== (user?._id || user?.id) && (
                          <button
                            onClick={() => deleteUser(u._id)}
                            style={{
                              background: "#1f1010",
                              color: "#ef4444",
                              border: "1px solid #7f1d1d",
                              borderRadius: "8px",
                              padding: "6px 14px",
                              fontSize: "13px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "#ef4444";
                              e.target.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "#1f1010";
                              e.target.style.color = "#ef4444";
                            }}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* Events Table */
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: "#1a1a2e",
                    borderBottom: "1px solid #2a2a3e",
                  }}>
                  {["Event", "Category", "Date", "Created By", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 20px",
                          textAlign: "left",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#6b7280",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}>
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => {
                  const cc =
                    categoryColors[ev.category] || categoryColors.Other;
                  return (
                    <tr
                      key={ev._id}
                      style={{
                        borderBottom:
                          i < events.length - 1 ? "1px solid #1e1e2e" : "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#1a1a2e")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontWeight: "600",
                          color: "#e0d9ff",
                          fontSize: "14px",
                        }}>
                        {ev.name}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            background: cc.bg,
                            color: cc.color,
                            borderRadius: "6px",
                            padding: "3px 10px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}>
                          {ev.category}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          color: "#4b5563",
                          fontSize: "13px",
                        }}>
                        {new Date(ev.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          color: "#6b7280",
                          fontSize: "14px",
                        }}>
                        {ev.createdBy?.name || "Unknown"}
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          display: "flex",
                          gap: "8px",
                        }}>
                        <button
                          onClick={() => navigate(`/events/${ev._id}`)}
                          style={{
                            background: "#1a1333",
                            color: "#a78bfa",
                            border: "1px solid #3b2d6e",
                            borderRadius: "8px",
                            padding: "6px 14px",
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#a78bfa";
                            e.target.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#1a1333";
                            e.target.style.color = "#a78bfa";
                          }}>
                          View
                        </button>
                        <button
                          onClick={() => deleteEvent(ev._id)}
                          style={{
                            background: "#1f1010",
                            color: "#ef4444",
                            border: "1px solid #7f1d1d",
                            borderRadius: "8px",
                            padding: "6px 14px",
                            fontSize: "13px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#ef4444";
                            e.target.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "#1f1010";
                            e.target.style.color = "#ef4444";
                          }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
