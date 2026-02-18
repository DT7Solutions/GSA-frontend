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
    const [compatibilityMap, setCompatibilityMap] = useState({});
    
    const token = localStorage.getItem("accessToken");

    // Sample CSV/Excel template structure
    const templateHeaders = [
        'carMake', 'carModel', 'carVariant', 'partCategory', 'partGroup',
        'partName', 'partImageUrl', 'partNumber', 'figureNumber', 'price', 'salePrice',
        'discount', 'qty', 'sku', 'remarks', 'compatibility', 'description'
    ];

    // Download template function
    const downloadTemplate = async (format) => {

        if (format === "excel") {
            window.open(`${API_BASE_URL}api/home/download-bulk-template/`, "_blank");
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
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'xlsm') {
            parseExcel(file);
        } else {
            Swal.fire({
                title: 'Invalid File',
                text: 'Please upload a CSV or Excel file (.xlsx, .xls, .xlsm)',
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

        const normalize = (str) =>
            str
                ?.replace(/\u2013/g, '-')
                .replace(/\u00A0/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .toUpperCase();

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);

                const workbook = XLSX.read(data, {
                    type: 'array',
                    cellDates: false,
                    cellText: false
                });

                if (!workbook.SheetNames.includes("Products")) {
                    throw new Error("Products sheet not found.");
                }

                if (!workbook.SheetNames.includes("Compatibility_List")) {
                    throw new Error("Compatibility_List sheet not found.");
                }

                const productsSheet = workbook.Sheets["Products"];
                const compatSheet = workbook.Sheets["Compatibility_List"];

                const productsData = XLSX.utils.sheet_to_json(productsSheet, { raw: false });
                const compatData = XLSX.utils.sheet_to_json(compatSheet, { raw: false });

                if (!productsData.length) {
                    throw new Error("Products sheet is empty.");
                }

                const compatMap = {};

                compatData.forEach(row => {
                    if (row.DisplayName && row.ID) {
                        compatMap[normalize(row.DisplayName)] = String(row.ID);
                    }
                });

                if (Object.keys(compatMap).length === 0) {
                    throw new Error("Compatibility list is empty or corrupted.");
                }

                validateAndSetData(productsData, compatMap);

            } catch (error) {
                console.error("Excel parse error:", error);

                Swal.fire({
                    title: 'Excel Parse Error',
                    text: error.message || 'Failed to read Excel file.',
                    icon: 'error',
                });
            }
        };

        reader.onerror = () => {
            Swal.fire({
                title: 'File Read Error',
                text: 'Unable to read the selected file.',
                icon: 'error',
            });
        };

        reader.readAsArrayBuffer(file);
    };

    // Validate parsed data
    const validateAndSetData = (data, compatMap) => {
        if (!compatMap || Object.keys(compatMap).length === 0) {
            Swal.fire({
                title: 'Invalid Template',
                text: 'Compatibility mapping could not be loaded. Please download a fresh template.',
                icon: 'error',
            });
            return;
        }

        const normalize = (str) =>
            str
                ?.replace(/\u2013/g, '-')     // Replace en dash with normal dash
                .replace(/\s+/g, ' ')         // Collapse multiple spaces
                .trim()
                .toUpperCase();

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

            // Required fields
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

            // Compatibility validation + conversion
            if (row.compatibility && row.compatibility.trim() !== '') {

                const compatList = row.compatibility
                    .split(',')
                    .map(item => normalize(item))
                    .filter(Boolean);

                const invalidCompat = compatList.filter(name => !compatMap[name]);

                if (invalidCompat.length > 0) {
                    rowErrors.push(`Invalid compatibility: ${invalidCompat.join(', ')}`);
                } else {
                    const compatIds = compatList.map(name => compatMap[name]);

                    // 🔥 Replace display names with ID string
                    row.compatibility = compatIds.join(',');
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
                console.log("FINAL COMPATIBILITY VALUE:", item.compatibility);

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

                if (item.partImageUrl && item.partImageUrl.trim() !== '') {
                    formData.append('product_image', item.partImageUrl);
                }

                // 🔥 Now this is already ID string
                if (item.compatibility && item.compatibility.trim() !== '') {
                    formData.append('compatibility', item.compatibility);
                }

                try {
                    await axios.post(`${API_BASE_URL}api/home/upload_products/`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    successCount++;
                } catch (error) {
                    failCount++;
                    failedItems.push({
                        row: i + 2,
                        partName: item.partName,
                        error: error.response?.data?.errors
                            ? JSON.stringify(error.response.data.errors)
                            : error.response?.data?.message ||
                            error.response?.data?.error ||
                            'Unknown error'
                        ,
                    });
                }

                setUploadProgress(Math.round(((i + 1) / totalItems) * 100));
            }

            setIsProcessing(false);

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
                                        {/* <button
                                            className="btn-theme-admin btn-outline-primary gap-2 btn-sm"
                                            onClick={() => downloadTemplate('csv')}
                                        >
                                            <Icon icon="lucide:download" /> Download CSV Template
                                        </button> */}
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
                                        accept=".xlsx, .xls, .xlsm"
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