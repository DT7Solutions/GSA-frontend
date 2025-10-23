import React, { forwardRef } from "react";

const PackingSlipTemplate = forwardRef(({ order = {}, company = {} }, ref) => {
  const user = order.user || {};
  const items = order.items || [];

  // ✅ Calculate totals safely (supports various backend field names)
  const subtotal = items.reduce(
    (sum, it) =>
      sum +
      (Number(it.unit_price) ||
        Number(it.price) ||
        Number(it.unitPrice) ||
        0) *
        (Number(it.quantity) || 1),
    0
  );

  const taxPct = 0.18;
  const taxAmount = subtotal * taxPct;
  const grandTotal = subtotal + taxAmount;

  const styles = {
    container: {
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: "880px",
      padding: "30px 15px",
      zIndex: 10,
      fontFamily: "Arial, sans-serif",
      wordSpacing: "1px",
      letterSpacing: "0.5px",
      wordBreak: "break-word",
      overflowWrap: "break-word",
      lineHeight: "1.5",
    },
    invoice: {
      background: "#fff",
      borderRadius: "10px",
      padding: "50px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    invoiceHead: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
    //   borderBottom: "1px solid #eaeaea",
      paddingBottom: "25px",
      marginBottom: "20px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#0068A5",
    },
    border: {
      border: "1px dashed rgba(73,73,73,.769)",
      margin: "20px 0",
    },
    addressSection: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "40px",
      flexWrap: "wrap",
      marginBottom: "50px",
    },
    addressBlock: {
      flex: "1",
      minWidth: "260px",
      lineHeight: "1.6",
    },
    strongText: {
      fontWeight: "bold",
      color: "#0068A5",
      marginBottom: "8px",
      display: "block",
    },
    textRight: {
      textAlign: "right",
    },
    tableResponsive: {
      overflowX: "auto",
      width: "100%",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed",
      wordBreak: "break-word",
    },
    thtd: {
      lineHeight: "1.55em",
      padding: "10px 15px",
      border: "1px solid #ccc",
      textAlign: "left",
      wordBreak: "break-word",
      whiteSpace: "normal",
    },
    focusBg: {
      background: "#f6f6f6",
    },
    textCenter: {
      textAlign: "center",
    },
    footer: {
      textAlign: "center",
      marginTop: "40px",
      fontSize: "14px",
      color: "#333",
    },
  };

  return (
    <div ref={ref} style={styles.container}>
      <div style={styles.invoice}>
        {/* Header */}
        <div style={styles.invoiceHead}>
          <div style={styles.title}>PACKING SLIP</div>
          <div style={styles.textRight}>
            <div>Invoice #: {order.razorpay_order_id || order.id || "-"}</div>
            <div>
              Date:{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString()
                : "-"}
            </div>
          </div>
        </div>

        <div style={styles.border}></div>

        {/* Address Section */}
        <div style={styles.addressSection}>
          {/* From (Company) */}
          <div style={styles.addressBlock}>
            <b style={styles.strongText}>From:</b>
            <div>{company.name || "GowriSankar Agencies"}</div>
            <div>
              {company.addressLine1 ||
                "PLOT NO.381, PHASE 1 & 2, INDIRA AUTONAGAR"}
            </div>
            <div>{company.cityState || "Guntur, Andhra Pradesh"}</div>
            <div>Phone: {company.phone || "+91 92480 22760"}</div>
          </div>

          {/* Deliver To (Customer) */}
          <div style={{ ...styles.addressBlock, ...styles.textRight }}>
            <b style={styles.strongText}>Deliver To:</b>
            <div>
              {user.first_name || ""} {user.last_name || ""}
            </div>
            <div>{user.address || ""}</div>
            <div>
              {user.city || ""}, {user.state || ""}{" "}
              {user.pincode ? `- ${user.pincode}` : ""}
            </div>
            <div>Phone: {user.phone || ""}</div>
          </div>
        </div>

        {/* Items Table */}
        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.focusBg}>
                <th style={styles.thtd}>S.L</th>
                <th style={styles.thtd}>Product Name</th>
                <th style={styles.thtd}>Quantity</th>
                <th style={styles.thtd}>Unit Price (₹)</th>
                <th style={styles.thtd}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((item, idx) => {
                  const qty = Number(item.quantity) || 1;
                  const unitPrice =
                    Number(item.unit_price) ||
                    Number(item.price) ||
                    Number(item.unitPrice) ||
                    0;
                  const total = qty * unitPrice;
                  return (
                    <tr key={idx}>
                      <td style={styles.thtd}>{idx + 1}</td>
                      <td style={styles.thtd}>
                        {item.part_group_name || item.name || "N/A"}
                      </td>
                      <td style={styles.thtd}>{qty}</td>
                      <td style={styles.thtd}>{unitPrice.toFixed(2)}</td>
                      <td style={styles.thtd}>{total.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    style={{ ...styles.thtd, ...styles.textCenter }}
                    colSpan={5}
                  >
                    No items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        {items.length > 0 && (
          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
            <div>Tax (18%): ₹{taxAmount.toFixed(2)}</div>
            <div>
              <strong>Grand Total: ₹{grandTotal.toFixed(2)}</strong>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          Thank you for your business! <br />
          {company.name || "GowriSankar Agencies"}
        </div>
      </div>
    </div>
  );
});

export default PackingSlipTemplate;
