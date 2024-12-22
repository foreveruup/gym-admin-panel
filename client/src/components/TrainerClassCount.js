import React from 'react';

function TrainerClassCount({ trainerClassCount }) {
    return (
        <div>
            <h2>Trainer Class Count</h2>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                padding: "10px"
            }}>
                {trainerClassCount.map(trainer => (
                    <div key={trainer.trainer_name} style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        width: "200px",
                        textAlign: "center"
                    }}>
                        <h3 style={{ margin: "0 0 10px", fontSize: "18px", color: "#333" }}>
                            {trainer.trainer_name}
                        </h3>
                        <p style={{ margin: "0", fontSize: "16px", color: "#666" }}>
                            {trainer.class_count} Classes
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrainerClassCount;

