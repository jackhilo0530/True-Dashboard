import React, {useState} from "react";
import {loginApi} from "../../api/auth";

type Props = {
    goDashboard: () => void;
    goSignup: () => void;
    onLoginSuccess: () => void;
};

const Login: React.FC<Props> = ({goDashboard, goSignup, onLoginSuccess}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if(!email || !password) {
            alert("please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const res = await loginApi(email, password);

            if(!res.token) {
                alert("no token in login response.");
                return;
            }
            localStorage.setItem("token", res.token);

            alert("Congratulation!");
            onLoginSuccess();
            goDashboard();
        } catch (err) {
            console.error(err);
            alert("network error during login.");
        }finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>login</h2>

            <div style={{marginBottom: 12}}>
                <label>
                    email
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{display: "block", width: "100%", padding: 6}}
                    />
                </label>
            </div>

            <div style={{marginBottom: 12}}>
                <label>
                    password
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{display: "block", width: "100%", padding: 6}} 
                    />
                </label>
            </div>

            <button onClick={handleLogin} disabled={loading}>
                {loading ? "processing..." : "ok"}
            </button>

            <div style={{marginTop: 10}}>
                <button
                    style={linkButtonStyle}
                    onClick={goSignup}
                >
                    create new account
                </button>
                <br />
                <button
                    style={linkButtonStyle}
                    onClick={goDashboard}
                >
                    back to dashboard
                </button>
            </div>
        </div>
    );
};

const linkButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    color: "blue",
    textDecoration: "underline",
    cursor: "pointer",
};

export default Login;