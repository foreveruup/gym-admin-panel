import React from 'react';

function ClassStatistics({ classStats }) {
    return (
        <div>
            <h2>Class Statistics</h2>
            <table>
                <thead>
                <tr>
                    <th>Class Name</th>
                    <th>Member Count</th>
                    <th>Capacity</th>
                    <th>Available Spots</th>
                </tr>
                </thead>
                <tbody>
                {classStats.map(stat => (
                    <tr key={stat.name}>
                        <td>{stat.name}</td>
                        <td>{stat.member_count}</td>
                        <td>{stat.capacity}</td>
                        <td>{stat.available_spots}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClassStatistics;

