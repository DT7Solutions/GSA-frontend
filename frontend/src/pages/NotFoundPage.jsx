import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const BRAND_BLUE = "#0068A5";

const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Illustration */}
        <div style={{ marginBottom: "24px" }}>
          <Icon
            icon="mdi:cog-outline"
            style={{ fontSize: "48px", color: BRAND_BLUE, margin: "0 6px" }}
          />
          <Icon
            icon="mdi:cog"
            style={{ fontSize: "64px", color: BRAND_BLUE, margin: "0 6px" }}
          />
          <Icon
            icon="mdi:cog-outline"
            style={{ fontSize: "48px", color: BRAND_BLUE, margin: "0 6px" }}
          />
        </div>

        {/* 404 */}
        <h1
          style={{
            fontSize: "130px!important",
            fontWeight: "800",
            color: BRAND_BLUE,
            margin: "0 0 10px",
          }}
        >
          404
        </h1>

        {/* Title */}
        <h2
          style={{
            fontSize: "25px",
            fontWeight: "700",
            marginBottom: "10px",
            color: "#0f172a",
          }}
        >
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: "16px",
            color: "#475569",
            lineHeight: "1.6",
            marginBottom: "32px",
            maxWidth: "520px",
            marginInline: "auto",
          }}
        >
          The spare part or page you're looking for may have moved or doesn't
          exist.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "40px",
          }}
        >
          <Link
            to="/"
            style={{
              padding: "12px 28px",
              background: BRAND_BLUE,
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Icon icon="carbon:home" />
            Go to Home
          </Link>

          

          <Link
            to="/contact"
            style={{
              padding: "12px 10px",
              color: BRAND_BLUE,
              textDecoration: "none",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Icon icon="mdi:phone-outline" />
            Contact Us
          </Link>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "20px",
            fontSize: "14px",
            color: "#64748b",
          }}
        >
          <div style={{ marginBottom: "6px" }}>
            <Icon
              icon="mdi:gear"
              style={{ color: BRAND_BLUE, marginRight: "6px" }}
            />
            Trusted car spare parts supplier in{" "}
            <strong style={{ color: "#0f172a" }}>Guntur</strong>
          </div>
          <div style={{ fontSize: "13px" }}>
            Gowrisankar Agencies – Quality Parts Since Decades
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
