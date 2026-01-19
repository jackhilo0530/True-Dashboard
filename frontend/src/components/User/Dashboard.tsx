import React from "react";

type Props = {
    isLoggedIn: boolean;
    goSignup: () => void;
    goLogin: () => void;
    goProduct: () => void;
    logout: () => void;
};

const Dashboard: React.FC<Props> = ({
    isLoggedIn,
    goSignup,
    goLogin,
    goProduct,
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
                    <button onClick={goProduct}>product</button>
                    <button style={{marginLeft: 8}} onClick={logout}>
                        logout
                    </button>
                </>
            )}
        </div>
    );
};

export default Dashboard;