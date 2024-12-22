import React from 'react';

function EquipmentSummary({ equipmentSummary }) {
    return (
        <div>
            <h2>Equipment Summary</h2>
            {equipmentSummary ? (
                <div style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                    padding: "20px"
                }}>
                    <div style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        maxWidth: "400px",
                        textAlign: "center"
                    }}>
                        <h3 style={{
                            fontSize: "18px",
                            margin: "0 0 10px",
                            color: "#333"
                        }}>
                            Summary of Equipment
                        </h3>
                        <p style={{ fontSize: "16px", margin: "5px 0", color: "#555" }}>
                            <strong>Total Items:</strong> {equipmentSummary.total_items}
                        </p>
                        <p style={{ fontSize: "16px", margin: "5px 0", color: "#555" }}>
                            <strong>Total Quantity:</strong> {equipmentSummary.total_quantity}
                        </p>
                        <p style={{ fontSize: "16px", margin: "5px 0", color: "#555" }}>
                            <strong>Average Quantity:</strong> {equipmentSummary.average_quantity}
                        </p>
                    </div>
                </div>
            ) : (
                <p>No equipment summary available.</p>
            )}
        </div>
    );
}

export default EquipmentSummary;