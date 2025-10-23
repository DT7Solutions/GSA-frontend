import React, { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ order = {}, company = {} }, ref) => {
  const user = order.user || {};
  const items = order.items || [];

  // ✅ Calculate subtotal, tax, and grand total
  const subtotal = items.reduce(
    (s, it) => s + ((Number(it.price) || 0) * (Number(it.quantity) || 1)),
    0
  );
  const taxPct = 0.18;
  const taxAmount = subtotal * taxPct;
  const grandTotal = subtotal + taxAmount;

  // ✅ Styles
  const styles = {
    container: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '880px',
      padding: '30px 15px',
      zIndex: 10,
      fontFamily: 'Arial, sans-serif',
      wordSpacing: '1px',
      letterSpacing: '0.5px',
      lineHeight: '1.5',
    },
    invoice: {
      background: '#fff',
      borderRadius: '10px',
      padding: '50px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    invoiceHead: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      // borderBottom: '1px solid #eaeaea',
      paddingBottom: '25px',
      marginBottom: '20px',
    },
    logo: {
      marginRight: '20px',
      marginBottom: '5px',
    },
    textRight: {
      textAlign: 'right',
    },
    border: {
      border: '1px dashed rgba(73,73,73,.769)',
      margin: '20px 0',
    },
    addressBlock: {
      lineHeight: '1.6',
      marginTop: 0,
    },
    tableResponsive: {
      overflowX: 'auto',
      width: '100%',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
    },
    thtd: {
      lineHeight: '1.55em',
      padding: '10px 15px',
      border: '1px solid #ccc',
      textAlign: 'left',
      wordBreak: 'break-word',
      whiteSpace: 'normal',
    },
    focusBg: {
      background: '#f6f6f6',
    },
    textCenter: {
      textAlign: 'center',
    },
    totalsBox: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px 20px',
      width: '300px',
      float: 'right',
      marginTop: '20px',
      backgroundColor: '#fafafa',
    },
    totalsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
      fontSize: '15px',
    },
    totalsLabel: {
      fontWeight: 'bold',
      color: '#333',
    },
    totalsValue: {
      textAlign: 'right',
    },
    signature: {
      marginTop: '80px',
      textAlign: 'left',
    },
    note: {
      textAlign: 'center',
      marginTop: '40px',
      color: '#333',
      fontSize: '14px',
    },
    strongText: {
      fontWeight: 'bold',
      color: '#0068A5',
    },
  };

  return (
    <div style={styles.container} ref={ref}>
      <div style={styles.invoice}>
        {/* Header */}
        <div style={styles.invoiceHead}>
          <div>
            <div style={styles.logo}>
              <img
                src={company.logo || '/adminAssets/images/gallery/logo-light.png'}
                width="100"
                alt="Logo"
              />
            </div>
          </div>

          <div style={styles.textRight}>
            <div>
              <b>Invoice No:</b> #{order.razorpay_order_id || '—'}
            </div>
            <div>
              <b>Date:</b>{' '}
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString()
                : '—'}
            </div>
          </div>
        </div>

        <div style={styles.border}></div>

        {/* Address Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
          <div style={styles.addressBlock}>
            <b style={styles.strongText}>Invoice To:</b>
            <p>
              {user.first_name || ''} {user.last_name || ''}
              <br />
              {user.address || ''}
              <br />
              {user.city || ''}{user.city ? ', ' : ''}{user.state || ''}{' '}
              {user.pincode ? `- ${user.pincode}` : ''}
              <br />
              {user.country || ''}
            </p>
          </div>

          <div style={styles.textRight}>
            <b style={styles.strongText}>{company.name || 'GowriSankar Agencies'}:</b>
            <p style={{ marginTop: '5px' }}>
              {company.addressLine1 || 'PLOT NO.381, PHASE 1 & 2, INDIRA AUTONAGAR'}
              <br />
              {company.cityState || 'Guntur, Andhra Pradesh'}
              <br />
              {company.email || 'demo@email.com'}
              <br />
              {company.phone || '+91 92480 22760'}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.focusBg}>
                <th style={styles.thtd}>SL</th>
                <th style={styles.thtd}>Product</th>
                <th style={styles.thtd}>Rate (₹)</th>
                <th style={styles.thtd}>Qty</th>
                <th style={{ ...styles.thtd, textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((it, i) => {
                  const qty = Number(it.quantity) || 1;
                  const rate = Number(it.price) || 0;
                  const amount = rate * qty; // ✅ No tax in item amount
                  return (
                    <tr key={i} style={i % 2 ? styles.focusBg : {}}>
                      <td style={styles.thtd}>{String(i + 1).padStart(2, '0')}</td>
                      <td style={styles.thtd}>{it.part_group_name || it.name || 'Service'}</td>
                      <td style={styles.thtd}>{rate.toFixed(2)}</td>
                      <td style={styles.thtd}>{qty}</td>
                      <td style={{ ...styles.thtd, textAlign: 'right' }}>{amount.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ ...styles.thtd, ...styles.textCenter }}>
                    No items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Totals Box */}
        <div style={styles.totalsBox}>
          <div style={styles.totalsRow}>
            <span style={styles.totalsLabel}>Sub Total:</span>
            <span style={styles.totalsValue}>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={styles.totalsRow}>
            <span style={styles.totalsLabel}>Tax (18%):</span>
            <span style={styles.totalsValue}>₹{taxAmount.toFixed(2)}</span>
          </div>
          <div style={{ ...styles.totalsRow, borderTop: '1px solid #ccc', paddingTop: '8px', marginTop: '8px' }}>
            <span style={styles.totalsLabel}>Grand Total:</span>
            <span style={{ ...styles.totalsValue, fontWeight: 'bold' }}>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Signature */}
        <div style={styles.signature}>
          <img
            src={company.signature || '/assets/img/signature.png'}
            alt="signature"
            width="100"
          />
          <p>Authorized Signature</p>
        </div>

        {/* Note */}
        <div style={styles.note}>
          <p>
            Thank you for your business! <br />
            This is a system-generated invoice.
          </p>
        </div>
      </div>
    </div>
  );
});

export default InvoiceTemplate;
