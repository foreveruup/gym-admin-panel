import React from 'react';

function ClassList({ classes }) {
    return (
        <div>
            <h2>Classes</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ background: "#f4f4f4", textAlign: "left" }}>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Class Name</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Schedule</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Capacity</th>
                </tr>
                </thead>
                <tbody>
                {classes.map(cls => (
                    <tr key={cls.id}>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>{cls.name}</td>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>{cls.schedule}</td>
                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>{cls.capacity}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClassList;


