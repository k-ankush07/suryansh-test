
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import {
  AppProvider as ShopifyAppProvider,
} from "@shopify/shopify-app-react-router/react";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
  };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <ShopifyAppProvider embedded apiKey={apiKey}>
      <PolarisProvider i18n={enTranslations}>
        <s-app-nav>
          <s-link href="/app">Home</s-link>
          <s-link href="/app/dashboard">Dashboard</s-link>
          <s-link href="/app/form">Form Bulider</s-link>
          <s-link href="/app/products">Products</s-link>
          <s-link href="/app/createproduct">Create Products</s-link>
          <s-link href="/app/updateproduct">Update Products</s-link>
          <s-link href="/app/additional">Additional page</s-link>
        </s-app-nav>

        <Outlet />
      </PolarisProvider>
    </ShopifyAppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
