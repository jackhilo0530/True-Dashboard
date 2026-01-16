import React, {useState} from "react";
import {signupApi} from "../../api/auth";

type Props = {
    goDashboard: () => void;
    goLogin: () => void;
};

const Signup: React.FC<Props> = ({goDashboard, goLogin}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async() => {
        if(!name || !email || !password || !confirm) {
            alert("please fill all fields.");
            return ;
        }

        if(password !== confirm) {
            alert("password and confirm do not match.");
            return;
        }

        try{
            setLoading(true);

            await signupApi(name, email, password);

            alert("sign up success. now you can log in.");
            goLogin();
        }catch (err) {
            console.error(err);
            alert("network error during sign up.");
        }finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>sign up</h2>

            <div style={{marginBottom:12}}>
                <label>
                    name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{display: "block", width: "100%", padding: 6}}
                    />
                </label>
            </div>

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

            <div style={{marginBottom: 12}}>
                <label>
                    confirm password
                    <input 
                        type="password" 
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        style={{display: "block", width: "100%", padding: 6}}
                    />
                </label>
            </div>

            <button onClick={handleSignup} disabled={loading}>
                {loading ? "processing..." : "ok"}
            </button>

            <div style={{marginTop: 10}}>
                <button
                    style={linkButtonStyle}
                    onClick={goLogin}
                >
                    already have an account? login
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
    color: "blut",
    textDecoration: "underline",
    cursor: "pointer",
};

export default Signup;