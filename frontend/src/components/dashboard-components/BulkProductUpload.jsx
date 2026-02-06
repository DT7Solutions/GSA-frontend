import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import Swal from 'sweetalert2';
import API_BASE_URL from '../../config';

const BulkProductUpload = () => {
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [validationErrors, setValidationErrors] = useState([]);
    
    const token = localStorage.getItem("accessToken");

    // Sample CSV/Excel template structure
    const templateHeaders = [
        'carMake', 'carModel', 'carVariant', 'partCategory', 'partGroup',
        'partName', 'partImageUrl', 'partNumber', 'figureNumber', 'price', 'salePrice',
        'discount', 'qty', 'sku', 'remarks', 'compatibility', 'description'
    ];

    // Download template function
    const downloadTemplate = (format) => {
        const sampleData = [
            {
                carMake: 'Hyundai',
                carModel: 'Creta',
                carVariant: 'SX',
                partCategory: 'Engine Parts',
                partGroup: 'Oil Filters',
                partName: 'Engine Oil Filter',
                partImageUrl: 'https://example.com/images/oil-filter.jpg',
                partNumber: 'PN-12345',
                figureNumber: 'FIG-001',
                price: '1000',
                salePrice: '900',
                discount: '10',
                qty: '50',
                sku: 'SKU-12345',
                remarks: 'Premium quality filter',
                compatibility: 'Creta SX,Creta EX,Venue SX',
                description: 'High-quality engine oil filter for optimal performance'
            },
            {
                carMake: 'Maruti Suzuki',
                carModel: 'Swift',
                carVariant: 'VXI',
                partCategory: 'Brake System',
                partGroup: 'Brake Pads',
                partName: 'Front Brake Pad Set',
                partImageUrl: 'https://example.com/images/brake-pad.jpg',
                partNumber: 'BP-67890',
                figureNumber: 'FIG-002',
                price: '2500',
                salePrice: '2200',
                discount: '12',
                qty: '30',
                sku: 'SKU-67890',
                remarks: 'Ceramic brake pads',
                compatibility: 'Swift VXI,Swift ZXI',
                description: 'Premium ceramic brake pads for enhanced stopping power'
            }
        ];

        if (format === 'csv') {
            const csv = Papa.unparse(sampleData);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'bulk_products_template.csv';
            a.click();
        } else if (format === 'excel') {
            const ws = XLSX.utils.json_to_sheet(sampleData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Products');
            XLSX.writeFile(wb, 'bulk_products_template.xlsx');
        }
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadedFile(file);
        setValidationErrors([]);
        setParsedData([]);

        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (fileExtension === 'csv') {
            parseCSV(file);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            parseExcel(file);
        } else {
            Swal.fire({
                title: 'Invalid File',
                text: 'Please upload a CSV or Excel file',
                icon: 'error',
            });
        }
    };

    // Parse CSV file
    const parseCSV = (file) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false, // Keep as strings for better control
            complete: (results) => {
                validateAndSetData(results.data);
            },
            error: (error) => {
                Swal.fire({
                    title: 'Parse Error',
                    text: error.message,
                    icon: 'error',
                });
            },
        });
    };

    // Parse Excel file
    const parseExcel = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
                validateAndSetData(jsonData);
            } catch (error) {
                Swal.fire({
                    title: 'Parse Error',
                    text: 'Failed to parse Excel file',
                    icon: 'error',
                });
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // Validate parsed data
    const validateAndSetData = (data) => {
        const errors = [];
        const validData = [];

        data.forEach((row, index) => {
            const rowErrors = [];

            // Trim all string values
            Object.keys(row).forEach(key => {
                if (typeof row[key] === 'string') {
                    row[key] = row[key].trim();
                }
            });

            // Required field validation (using name-based matching)
            if (!row.carMake) rowErrors.push('carMake is required');
            if (!row.carModel) rowErrors.push('carModel is required');
            if (!row.carVariant) rowErrors.push('carVariant is required');
            if (!row.partCategory) rowErrors.push('partCategory is required');
            if (!row.partGroup) rowErrors.push('partGroup is required');
            if (!row.partName) rowErrors.push('partName is required');
            if (!row.partNumber) rowErrors.push('partNumber is required');
            if (!row.price) rowErrors.push('price is required');

            // Numeric validation
            if (row.price && isNaN(parseFloat(row.price))) rowErrors.push('price must be numeric');
            if (row.salePrice && row.salePrice !== '' && isNaN(parseFloat(row.salePrice))) rowErrors.push('salePrice must be numeric');
            if (row.discount && row.discount !== '' && isNaN(parseFloat(row.discount))) rowErrors.push('discount must be numeric');
            if (row.qty && row.qty !== '' && isNaN(parseInt(row.qty))) rowErrors.push('qty must be numeric');

            // Image URL validation (if provided)
            if (row.partImageUrl && row.partImageUrl.trim() !== '') {
                const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                if (!urlPattern.test(row.partImageUrl)) {
                    rowErrors.push('partImageUrl must be a valid URL');
                }
            }

            // Compatibility validation (if provided)
            if (row.compatibility && row.compatibility.trim() !== '') {
                // Compatibility can be comma-separated variant names
                const compatList = row.compatibility.split(',').map(item => item.trim());
                if (compatList.length === 0) {
                    rowErrors.push('compatibility must contain comma-separated variant names');
                }
            }

            if (rowErrors.length > 0) {
                errors.push({ row: index + 2, errors: rowErrors });
            } else {
                validData.push(row);
            }
        });

        setValidationErrors(errors);
        setParsedData(validData);

        if (errors.length > 0) {
            Swal.fire({
                title: 'Validation Errors',
                html: `Found ${errors.length} rows with errors. Please check the preview.`,
                icon: 'warning',
            });
        }
    };

    // Handle bulk upload
    const handleBulkUpload = async () => {
        if (parsedData.length === 0) {
            Swal.fire({
                title: 'No Data',
                text: 'Please upload a valid file with data',
                icon: 'warning',
            });
            return;
        }

        if (validationErrors.length > 0) {
            Swal.fire({
                title: 'Validation Errors',
                text: 'Please fix validation errors before uploading',
                icon: 'error',
            });
            return;
        }

        setIsProcessing(true);
        setUploadProgress(0);

        try {
            const totalItems = parsedData.length;
            let successCount = 0;
            let failCount = 0;
            const failedItems = [];

            for (let i = 0; i < parsedData.length; i++) {
                const item = parsedData[i];
                
                const formData = new FormData();
                
                // Send name-based matching data
                formData.append('car_make', item.carMake);
                formData.append('car_model', item.carModel);
                formData.append('car_variant', item.carVariant);
                formData.append('part_section', item.partCategory);
                formData.append('part_group', item.partGroup);
                formData.append('product_name', item.partName);
                formData.append('part_no', item.partNumber);
                formData.append('fig_no', item.figureNumber || '');
                formData.append('price', item.price);
                formData.append('sale_price', item.salePrice || '');
                formData.append('discount', item.discount || '0');
                formData.append('qty', item.qty || '0');
                formData.append('stock_count', item.qty || '0');
                formData.append('sku', item.sku || '');
                formData.append('remarks', item.remarks || '');
                formData.append('description', item.description || '');
                formData.append('is_available', 'true');
                
                // Handle image URL - send as URL string for backend to download
                if (item.partImageUrl && item.partImageUrl.trim() !== '') {
                    formData.append('product_image', item.partImageUrl);
                }
                
                // Handle compatibility - send as comma-separated string
                if (item.compatibility && item.compatibility.trim() !== '') {
                    formData.append('compatibility', item.compatibility);
                }

                try {
                    await axios.post(`${API_BASE_URL}api/home/upload_products/`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    successCount++;
                } catch (error) {
                    failCount++;
                    failedItems.push({
                        row: i + 2,
                        partName: item.partName,
                        error: error.response?.data?.message || error.response?.data?.error || 'Unknown error',
                    });
                    console.error(`Failed to upload row ${i + 2}:`, error.response?.data);
                }

                setUploadProgress(Math.round(((i + 1) / totalItems) * 100));
            }

            setIsProcessing(false);

            // Show results
            if (failCount === 0) {
                Swal.fire({
                    title: 'Success!',
                    text: `All ${successCount} products uploaded successfully`,
                    icon: 'success',
                });
                setShowBulkModal(false);
                setParsedData([]);
                setUploadedFile(null);
            } else {
                Swal.fire({
                    title: 'Upload Complete',
                    html: `
                        <p><strong>Success:</strong> ${successCount}</p>
                        <p><strong>Failed:</strong> ${failCount}</p>
                        <details>
                            <summary>View Failed Items</summary>
                            <ul style="text-align: left; max-height: 200px; overflow-y: auto;">
                                ${failedItems.map(item => `<li>Row ${item.row} (${item.partName}): ${item.error}</li>`).join('')}
                            </ul>
                        </details>
                    `,
                    icon: failCount > successCount ? 'error' : 'warning',
                });
            }
        } catch (error) {
            setIsProcessing(false);
            Swal.fire({
                title: 'Upload Failed',
                text: error.message,
                icon: 'error',
            });
        }
    };

    return (
        <>
            {/* Bulk Upload Button */}
            <button
                type="button"
                className="btn-theme-admin btn-success justify-content-center d-flex align-items-center gap-2"
                onClick={() => setShowBulkModal(true)}
                style={{ marginLeft: '10px' }}
            >
                <Icon icon="lucide:upload" /> Bulk Upload
            </button>

            {/* Bulk Upload Modal */}
            {showBulkModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Bulk Products Upload</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowBulkModal(false)}
                                >
                                    X
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Instructions */}
                                <div className="alert alert-info mb-4">
                                    <h6><Icon icon="lucide:info" /> Important Instructions:</h6>
                                    <ul className="mb-0">
                                        <li>Use exact names for Car Make, Model, Variant, Part Category, and Part Group</li>
                                        <li>Image URLs must be valid and publicly accessible</li>
                                        <li>Compatibility format: "Variant1,Variant2,Variant3"</li>
                                        <li>All price and quantity fields must be numeric</li>
                                    </ul>
                                </div>

                                {/* Download Templates */}
                                <div className="mb-4">
                                    <h6>Step 1: Download Template</h6>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn-theme-admin btn-outline-primary gap-2 btn-sm"
                                            onClick={() => downloadTemplate('csv')}
                                        >
                                            <Icon icon="lucide:download" /> Download CSV Template
                                        </button>
                                        <button
                                            className="btn-theme-admin btn-outline-primary gap-2 btn-outline-success btn-sm"
                                            onClick={() => downloadTemplate('excel')}
                                        >
                                            <Icon icon="lucide:download" /> Download Excel Template
                                        </button>
                                    </div>
                                </div>
.
                                {/* File Upload */}
                                <div className="mb-4">
                                    <h6>Step 2: Upload File</h6>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileChange}
                                    />
                                    {uploadedFile && (
                                        <small className="text-muted">
                                            Selected: {uploadedFile.name}
                                        </small>
                                    )}
                                </div>

                                {/* Validation Errors */}
                                {validationErrors.length > 0 && (
                                    <div className="alert alert-danger">
                                        <h6>Validation Errors ({validationErrors.length})</h6>
                                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {validationErrors.map((error, index) => (
                                                <div key={index}>
                                                    <strong>Row {error.row}:</strong>{' '}
                                                    {error.errors.join(', ')}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Data Preview */}
                                {parsedData.length > 0 && (
                                    <div className="mb-4">
                                        <h6>Data Preview ({parsedData.length} valid rows)</h6>
                                        <div style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'auto' }}>
                                            <table className="table table-sm table-bordered">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Image</th>
                                                        <th>Car Make</th>
                                                        <th>Car Model</th>
                                                        <th>Variant</th>
                                                        <th>Part Name</th>
                                                        <th>Part Number</th>
                                                        <th>Price</th>
                                                        <th>QTY</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {parsedData.slice(0, 10).map((row, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {row.partImageUrl ? (
                                                                    <img 
                                                                        src={row.partImageUrl} 
                                                                        alt={row.partName}
                                                                        style={{ 
                                                                            width: '40px', 
                                                                            height: '40px', 
                                                                            objectFit: 'cover',
                                                                            borderRadius: '4px'
                                                                        }}
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'block';
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <span style={{ display: 'none', fontSize: '10px' }}>No Image</span>
                                                            </td>
                                                            <td>{row.carMake}</td>
                                                            <td>{row.carModel}</td>
                                                            <td>{row.carVariant}</td>
                                                            <td>{row.partName}</td>
                                                            <td>{row.partNumber}</td>
                                                            <td>{row.price}</td>
                                                            <td>{row.qty}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {parsedData.length > 10 && (
                                                <small className="text-muted">
                                                    Showing first 10 of {parsedData.length} rows
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Progress */}
                                {isProcessing && (
                                    <div className="mb-4">
                                        <h6>Uploading... {uploadProgress}%</h6>
                                        <div className="progress">
                                            <div
                                                className="progress-bar progress-bar-striped progress-bar-animated"
                                                role="progressbar"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <div className="d-flex gap-2 mt-3">
                                    <button
                                        className="btn-theme-admin  gap-2 btn-primary"
                                        onClick={handleBulkUpload}
                                        disabled={parsedData.length === 0 || isProcessing || validationErrors.length > 0}
                                    >
                                        <Icon icon="lucide:upload" />{' '}
                                        {isProcessing ? 'Uploading...' : 'Upload Products'}
                                    </button>
                                    <button
                                        className="btn-theme-admin  gap-2 btn-secondary"
                                        onClick={() => setShowBulkModal(false)}
                                        disabled={isProcessing}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BulkProductUpload;