import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Sidebar from "../Sidebar";
import { Icon } from "@fluentui/react";

// Responsive breakpoints
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const SIDEBAR_WIDTH = 220;

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface StyledProps {
  isSidebarOpen: boolean;
}

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background: #181a17;
  overflow: hidden;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main";
  }
`;

const SidebarWrapper = styled.div<StyledProps>`
  grid-area: sidebar;
  width: ${SIDEBAR_WIDTH}px;
  z-index: 100;
  transition: transform 0.3s ease;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(${(props) => (props.isSidebarOpen ? 0 : -100)}%);
    box-shadow: ${(props) =>
      props.isSidebarOpen ? "2px 0 8px rgba(0, 0, 0, 0.2)" : "none"};
  }
`;

const HeaderArea = styled.div`
  grid-area: header;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 50px;
  background: rgba(0, 0, 0, 0.3);

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    padding-left: 60px; /* Leave space for menu button */
  }
`;

const ContentWrapper = styled.div`
  grid-area: main;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 5px;
  left: 10px;
  z-index: 1001;
  background: #232422;
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  transition: background-color 0.2s;

  &:hover,
  &:focus {
    background: #2d2f2c;
    outline: none;
  }

  &:active {
    background: #1a1b19;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Overlay = styled.div<StyledProps>`
  display: none;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: ${(props) => (props.isSidebarOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`;

const PageTitle = styled.div`
  color: white;
  font-size: 14px;
  flex: 1;

  @media (min-width: ${MOBILE_BREAKPOINT}px) {
    font-size: 16px;
  }
`;

const ResponsiveLayout: React.FC<LayoutProps> = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(isMobileView);
      // On mobile, sidebar should be closed by default
      if (isMobileView && isSidebarOpen) {
        setIsSidebarOpen(false);
      } else if (!isMobileView && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    // Check on initial load
    checkIfMobile();

    // Get current path
    setCurrentPath(window.location.pathname);

    // Add resize listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <LayoutContainer>
      <MobileMenuButton onClick={toggleSidebar} aria-label="Toggle menu">
        <Icon iconName={isSidebarOpen ? "Cancel" : "GlobalNavButton"} />
      </MobileMenuButton>

      <Overlay
        isSidebarOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(false)}
      />

      <SidebarWrapper isSidebarOpen={isSidebarOpen}>
        <Sidebar />
      </SidebarWrapper>

      <ContentWrapper>{children}</ContentWrapper>
    </LayoutContainer>
  );
};

export default ResponsiveLayout;
