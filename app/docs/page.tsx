'use client';

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerDocsPage() {
  return (
    <div style={{ height: "100vh" }}>
      <SwaggerUI 
        url="/api/doc"
        docExpansion="list"
        defaultModelsExpandDepth={-1}
        filter={true}
      />
    </div>
  );
}
