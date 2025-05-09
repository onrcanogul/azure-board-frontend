import styled from "@emotion/styled";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const EmptyContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  color: white;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  text-align: center;
`;

const EmptyPage = () => {
  const location = useLocation();
  const pageName = location.pathname.substring(1); // Remove the leading '/'
  const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  useEffect(() => {
    console.log("EmptyPage rendered with path:", location.pathname);
  }, [location]);

  return (
    <ResponsiveLayout title={`${pageTitle} Page`}>
      <EmptyContent>
        <h1>{pageTitle} Page</h1>
        <p>This page is under construction.</p>
      </EmptyContent>
    </ResponsiveLayout>
  );
};

export default EmptyPage;
