import React from 'react';

function SearchMembers({ searchKeyword, setSearchKeyword, handleSearch, searchResults }) {
    return (
        <div style={{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px"
        }}>
            <h2 style={{
                fontSize: "22px",
                marginBottom: "15px",
                color: "#333",
                textAlign: "center"
            }}>Search Members</h2>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px"
            }}>
                <input
                    type="text"
                    placeholder="Enter keyword (name, email, type)"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        width: "70%",
                        boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)"
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    Search
                </button>
            </div>
            <div>
                {searchResults.length > 0 ? (
                    <ul style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        maxHeight: "200px",
                        overflowY: "auto"
                    }}>
                        {searchResults.map(member => (
                            <li key={member.id} style={{
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                                color: "#333"
                            }}>
                                <strong>{member.name}</strong> - {member.email}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{
                        color: "#666",
                        textAlign: "center"
                    }}>No members found</p>
                )}
            </div>
        </div>
    );
}

export default SearchMembers;