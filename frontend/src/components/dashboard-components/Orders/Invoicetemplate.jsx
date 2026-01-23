import React, { forwardRef } from 'react';

const InvoiceTemplate = forwardRef(({ order = {}, company = {} }, ref) => {
  const user = order.user || {};
  const items = order.items || [];
  const shippingAddress = order.shipping_address || {};

  console.log("📄 Invoice - Full Order Data:", JSON.stringify(order, null, 2));
  console.log("🚚 Invoice - Shipping Address:", JSON.stringify(shippingAddress, null, 2));
  console.log("👤 Invoice - User Data:", JSON.stringify(user, null, 2));

  // ✅ Calculate totals with GST inclusive pricing
  const taxPct = 0.18;
  const totalWithGst = items.reduce(
    (s, it) => s + ((Number(it.price) || 0) * (Number(it.quantity) || 1)),
    0
  );
  
  // Calculate base price (excluding GST) and tax amount
  const subtotal = totalWithGst / (1 + taxPct);
  const taxAmount = totalWithGst - subtotal;
  const grandTotal = totalWithGst;

  // ✅ Prepare shipping address for display
  const deliveryAddress = {
    name: shippingAddress?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "N/A",
    email: shippingAddress?.email || user?.email || "",
    address: shippingAddress?.address || user?.address || "",
    city: shippingAddress?.city || user?.city || "",
    district: shippingAddress?.district || user?.district || "",
    state: shippingAddress?.state || user?.state || "",
    zip: shippingAddress?.zip || shippingAddress?.pincode || user?.pincode || "",
    phone: shippingAddress?.phone || user?.phone || "",
  };

  // ✅ Company Tax Details (use from company prop or defaults)
  const companyDetails = {
    panNo: company.panNo || 'ABCDE1234F',
    gstNo: company.gstNo || '29ABCDE1234F1Z5',
  };

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
      lineHeight: '1.4em',
      padding: '8px 10px',
      border: '1px solid #ccc',
      textAlign: 'left',
      wordBreak: 'break-word',
      whiteSpace: 'normal',
      fontSize: '13px',
    },
    thHeader: {
      fontSize: '13px',
      fontWeight: 'bold',
    },
    focusBg: {
      background: '#f6f6f6',
    },
    textCenter: {
      textAlign: 'center',
    },
    // ✅ FIXED: Changed from float to flexbox layout
    totalsWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '20px',
      clear: 'both', // Ensures it appears after table
    },
    totalsBox: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px 20px',
      width: '300px',
      backgroundColor: '#fafafa',
    },
    totalsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
      fontSize: '14px',
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
      clear: 'both', // Ensures it appears after totals
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
    taxDetails: {
      marginTop: '8px',
      fontSize: '13px',
      color: '#555',
    },
    smallText: {
      fontSize: '11px',
      color: '#666',
    },
    invoiceContainer: {
      pageBreakInside: 'avoid',
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

        {/* Address Section - Updated to show both billing and shipping */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px', gap: '20px' }}>
          {/* Billing Address (User Info) */}
          <div style={styles.addressBlock}>
            <b style={styles.strongText}>Bill To:</b>
            <p>
              {user.first_name || ''} {user.last_name || ''}
              <br />
              {user.address || ''}
              <br />
              {user.city || ''}{user.city ? ', ' : ''}{user.state || ''}{' '}
              {user.pincode ? `- ${user.pincode}` : ''}
              <br />
              {user.phone && `Phone: ${user.phone}`}
            </p>
          </div>

          {/* Shipping Address (if different from billing) */}
          {shippingAddress && Object.keys(shippingAddress).length > 0 && (
            <div style={styles.addressBlock}>
              <b style={styles.strongText}>Ship To:</b>
              <p>
                {deliveryAddress.name && deliveryAddress.name !== 'N/A' && (
                  <>
                    {deliveryAddress.name}
                    <br />
                  </>
                )}
                {deliveryAddress.address && deliveryAddress.address !== 'N/A' && (
                  <>
                    {deliveryAddress.address}
                    <br />
                  </>
                )}
                {(deliveryAddress.city || deliveryAddress.district) && (
                  <>
                    {deliveryAddress.city}
                    {deliveryAddress.city && deliveryAddress.district && ', '}
                    {deliveryAddress.district}
                    <br />
                  </>
                )}
                {(deliveryAddress.state || deliveryAddress.zip) && (
                  <>
                    {deliveryAddress.state}
                    {deliveryAddress.state && deliveryAddress.zip && ' - '}
                    {deliveryAddress.zip}
                    <br />
                  </>
                )}
                {deliveryAddress.phone && `Phone: ${deliveryAddress.phone}`}
              </p>
            </div>
          )}

          {/* Company Address */}
          <div style={{ ...styles.addressBlock, ...styles.textRight }}>
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
            <div style={styles.taxDetails}>
              <div><b>PAN:</b> {companyDetails.panNo}</div>
              <div><b>GST:</b> {companyDetails.gstNo}</div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.focusBg}>
                <th style={{ ...styles.thtd, ...styles.thHeader, width: '10%' }}>SL</th>
                <th style={{ ...styles.thtd, ...styles.thHeader, width: '35%' }}>Product</th>
                {/* <th style={{ ...styles.thtd, ...styles.thHeader, width: '12%' }}>SKU</th>
                <th style={{ ...styles.thtd, ...styles.thHeader, width: '10%' }}>HSN</th> */}
                <th style={{ ...styles.thtd, ...styles.thHeader, width: '12%' }}>Rate (₹)<br/><span style={{fontSize: '10px', fontWeight: 'normal'}}>(incl. GST)</span></th>
                <th style={{ ...styles.thtd, ...styles.thHeader, width: '12%' }}>Qty</th>
                <th style={{ ...styles.thtd, ...styles.thHeader, width: '15%', textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((it, i) => {
                  const qty = Number(it.quantity) || 1;
                  const rateInclGst = Number(it.price) || 0;
                  const amount = rateInclGst * qty;
                  const productName = it.part_name || "N/A";
                  const sku = it.sku || "N/A";
                  const hsn = it.remarks || "8708";
                  
                  return (
                    <React.Fragment key={i}>
                      <tr style={i % 2 ? styles.focusBg : {}}>
                        <td style={styles.thtd}>{String(i + 1).padStart(2, '0')}</td>
                        <td style={styles.thtd}>{productName}</td>
                        {/* <td style={styles.thtd}>{sku}</td>
                        <td style={styles.thtd}>{hsn}</td> */}
                        <td style={styles.thtd}>{rateInclGst.toFixed(2)}</td>
                        <td style={styles.thtd}>{qty}</td>
                        <td style={{ ...styles.thtd, textAlign: 'right' }}>{amount.toFixed(2)}</td>
                      </tr>
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ ...styles.thtd, ...styles.textCenter }}>
                    No items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ FIXED: Totals Box - Now uses wrapper div with flexbox instead of float */}
        <div style={styles.totalsWrapper}>
          <div style={styles.totalsBox}>
            <div style={styles.totalsRow}>
              <span style={styles.totalsLabel}>Taxable Amount:</span>
              <span style={styles.totalsValue}>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.totalsRow}>
              <span style={styles.totalsLabel}>GST (18%):</span>
              <span style={styles.totalsValue}>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div style={{ ...styles.totalsRow, borderTop: '1px solid #ccc', paddingTop: '8px', marginTop: '8px' }}>
              <span style={styles.totalsLabel}>Total Amount:</span>
              <span style={{ ...styles.totalsValue, fontWeight: 'bold' }}>₹{grandTotal.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
              (All prices include GST)
            </div>
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