import React from "react";

type Props = {
    isLoggedIn: boolean;
    goSignup: () => void;
    goLogin: () => void;
    logout: () => void;
};

const Dashboard: React.FC<Props> = ({
    isLoggedIn,
    goSignup,
    goLogin,
    logout,
}) => {
    return (
        <div>
            {!isLoggedIn && (
                <>
                    <p>simeple demo for sign up and login.</p>
                    <button onClick={goSignup}>sign up</button>
                    <button style={{marginLeft: 8}} onClick={goLogin}>
                        login
                    </button>
                </>
            )}

            {isLoggedIn && (
                <>
                    <p>you are logged in.</p>
                    <button style={{marginLeft: 8}} onClick={logout}>
                        logout
                    </button>
                </>
            )}
        </div>
    );
};

export default Dashboard;