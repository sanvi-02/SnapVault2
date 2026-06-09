import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTags();
  }, [page, searchQuery]);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 30 });
      if (searchQuery.trim()) params.append("q", searchQuery.trim());
      const res = await API.get(`/tags?${params}`);
      setTags(res.data.tags);
      setTrending(res.data.trending || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
    setLoading(false);
  };

  // Color palette for tag cards
  const colors = [
    { bg: "#1a1333", border: "#3b2d6e", text: "#a78bfa" },
    { bg: "#1e1228", border: "#4a1d6e", text: "#c084fc" },
    { bg: "#1f1020", border: "#6b1f3a", text: "#f472b6" },
    { bg: "#0f1f14", border: "#166534", text: "#4ade80" },
    { bg: "#0f1829", border: "#1e3a5f", text: "#60a5fa" },
    { bg: "#1f1a0e", border: "#854d0e", text: "#fbbf24" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        fontFamily: "Georgia, serif",
      }}>
      <Navbar />

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#f0eeff",
              marginBottom: "8px",
            }}>
            🏷️ Explore Tags
          </h1>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>
            Discover photos by topic, category, and AI-generated labels
          </p>
        </div>

        {/* Search Tags */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#13131f",
            border: "1.5px solid #2a2a3e",
            borderRadius: "14px",
            padding: "10px 16px",
            marginBottom: "32px",
            maxWidth: "400px",
          }}>
          <span style={{ fontSize: "16px", marginRight: "10px" }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search tags..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "14px",
              color: "#e0d9ff",
              fontFamily: "Georgia, serif",
              width: "100%",
            }}
          />
        </div>

        {/* Trending Tags */}
        {!searchQuery && trending.length > 0 && (
          <div style={{ marginBottom: "36px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#f0eeff",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
              🔥 Trending Tags
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {trending.slice(0, 12).map((tag, i) => {
                const c = colors[i % colors.length];
                return (
                  <Link
                    key={tag._id}
                    to={`/tags/${tag.slug}`}
                    style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        background: c.bg,
                        border: `1.5px solid ${c.border}`,
                        borderRadius: "24px",
                        padding: "8px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 16px rgba(0,0,0,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}>
                      <span
                        style={{
                          color: c.text,
                          fontWeight: "600",
                          fontSize: "14px",
                        }}>
                        #{tag.name}
                      </span>
                      <span
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          borderRadius: "99px",
                          padding: "2px 8px",
                          fontSize: "11px",
                          color: c.text,
                          fontWeight: "600",
                        }}>
                        {tag.mediaCount}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* All Tags Grid */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: "#a78bfa",
              fontSize: "16px",
            }}>
            Loading tags...
          </div>
        ) : tags.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px",
              background: "#13131f",
              borderRadius: "20px",
              border: "1px solid #2a2a3e",
            }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏷️</div>
            <p style={{ color: "#6b7280", fontSize: "16px" }}>
              {searchQuery
                ? `No tags matching "${searchQuery}"`
                : "No tags yet"}
            </p>
          </div>
        ) : (
          <>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#f0eeff",
                marginBottom: "14px",
              }}>
              All Tags
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "12px",
                marginBottom: "24px",
              }}>
              {tags.map((tag, i) => {
                const c = colors[i % colors.length];
                return (
                  <Link
                    key={tag._id}
                    to={`/tags/${tag.slug}`}
                    style={{ textDecoration: "none" }}>
                    <div
                      style={{
                        background: "#13131f",
                        borderRadius: "14px",
                        padding: "16px",
                        border: "1px solid #2a2a3e",
                        transition: "all 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 20px rgba(167,139,250,0.12)";
                        e.currentTarget.style.borderColor = "#a78bfa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "#2a2a3e";
                      }}>
                      <span
                        style={{
                          color: c.text,
                          fontWeight: "700",
                          fontSize: "16px",
                        }}>
                        #{tag.name}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "8px",
                        }}>
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>
                          📷 {tag.mediaCount} photo
                          {tag.mediaCount !== 1 ? "s" : ""}
                        </span>
                        <span
                          style={{
                            background:
                              tag.source === "ai"
                                ? "#0f1829"
                                : tag.source === "both"
                                ? "#1f1a0e"
                                : "#0f1f14",
                            color:
                              tag.source === "ai"
                                ? "#60a5fa"
                                : tag.source === "both"
                                ? "#fbbf24"
                                : "#4ade80",
                            borderRadius: "6px",
                            padding: "1px 6px",
                            fontSize: "10px",
                            fontWeight: "600",
                          }}>
                          {tag.source === "ai"
                            ? "AI"
                            : tag.source === "both"
                            ? "AI+Manual"
                            : "Manual"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    background: page === 1 ? "#1a1a2e" : "#13131f",
                    border: "1px solid #2a2a3e",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    cursor: page === 1 ? "not-allowed" : "pointer",
                    color: page === 1 ? "#4b5563" : "#e0d9ff",
                  }}>
                  ← Prev
                </button>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "13px",
                    color: "#6b7280",
                  }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    background: page === totalPages ? "#1a1a2e" : "#13131f",
                    border: "1px solid #2a2a3e",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    cursor: page === totalPages ? "not-allowed" : "pointer",
                    color: page === totalPages ? "#4b5563" : "#e0d9ff",
                  }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TagsPage;
