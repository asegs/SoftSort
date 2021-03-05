import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const Example = (props) => {
    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => setCollapsed(!collapsed);

    return (
        <div>
            <Navbar color="faded" light>
                <NavbarBrand href="/" className="mr-auto">SoftSort</NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                <Collapse isOpen={!collapsed} navbar>
                    <Nav navbar>
                        <NavItem>
                            <NavLink href="/">Sort</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/upload">Upload data</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/account">Account management</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/about">About</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/joiner">File joiner (Alpha)</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default Example;
