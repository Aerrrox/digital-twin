import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header>
            <nav>
                <Link to="/">Главная</Link>
                <Link to="/plants">Растения</Link>
                <Link to="/plots">Участки</Link>
                <Link to="/beds">Грядки</Link>
            </nav>
        </header>
    );
}

export default Header;