import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ name, message }),
        });

        const data = await res.json();
        setResponse(data);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Send Message</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <textarea
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <br />
                <button type="submit">Send</button>
            </form>

            {response && (
                <pre style={{ background: "#f0f0f0", padding: "1rem" }}>
                    {JSON.stringify(response, null, 2)}
                </pre>
            )}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("app")).render(<App />);
