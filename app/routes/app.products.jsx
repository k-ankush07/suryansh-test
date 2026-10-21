import React from 'react'

import { authenticate } from '../shopify.server';
import { useFetcher, useLoaderData } from 'react-router';

//loader to get req or action to set 
export async function loader({ request }) {
    // authenticate the shopify admin request 
    const { admin } = await authenticate.admin(request)

    // get product api grapQApi
    const response = await admin.graphql(
        `
    #graphql
    query Get_products{
        products(first: 10){
            nodes{
            id
            title
           vendor
          productType
          descriptionHtml
          handle
          status

          images (first: 1) {
          nodes{
          url
          id
          altText
          }
          }

          variants(first: 1) {
          nodes{
          id
          title
          price
          sku
          inventoryPolicy
         compareAtPrice
          }
          }
            }
        }
    }
    `
    )
    // convert the response to javascript data
    const result = await response.json();
    // return product to the page 
    return {
        products: result.data.products.nodes
    }
}

// delete product 
export async function action({ request }) {
    // authenticate the shopify admin request 
    const { admin } = await authenticate.admin(request)
    const formData = await request.formData();
    const id = formData.get("id")
    const delresponse = await admin.graphql(
        `#graphql
            mutation DeleteProduct($input: ProductDeleteInput !){
                productDelete(input : $input){
                    deletedProductId
                         userErrors {
                            field
                            message
                        }
                    
                }
            }`,
        {
            variables: {
                input: {
                    id
                }
            }
        }
    )
    const result = await delresponse.json();
    const deletion = result.data?.productDelete;
    // show error if any 
    if (result.errors || !deletion || deletion.userErrors.length > 0) {
        return json(
            {
                error:
                    deletion?.userErrors?.map((e) => e.message).join(", ") ||
                    result.errors?.map((e) => e.message).join(", ") ||
                    "Failed to delete product",
            },
            { status: 400 }
        );
    }
    return {
        deletePrroduct: deletion.deletedproductId
    }
}


function Products() {
    // to get the data inside the products we use 

    //useLoaderData
    const { products } = useLoaderData();
    const fetcher = useFetcher();

    return (

        <div
            style={{
                padding: "30px",
                backgroundColor: "#f5f7fb",
                minHeight: "100vh",
                fontFamily: "Arial, sans-serif",
                color: "#1f2937",
            }}
        >

            <h1
                style={{
                    textAlign: "center",
                    fontSize: "32px",
                    marginBottom: "30px",
                    color: "#111827",
                }}
            >
                My Shopify Products
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "24px",
                }}
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        style={{
                            backgroundColor: "#ffffff",
                            padding: "24px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "14px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            minWidth: 0,
                        }}
                    >
                        {/* Product Header */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "20px",
                                flexWrap: "wrap",
                            }}
                        >
                            <h2 style={{ margin: 0, fontSize: "22px", color: "#111827" }}>
                                {product.title}
                            </h2>

                            <span
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    backgroundColor:
                                        product.status === "ACTIVE"
                                            ? "#dcfce7"
                                            : product.status === "DRAFT"
                                                ? "#fef3c7"
                                                : "#e5e7eb",
                                    color:
                                        product.status === "ACTIVE"
                                            ? "#166534"
                                            : product.status === "DRAFT"
                                                ? "#92400e"
                                                : "#374151",
                                }}
                            >
                                {product.status}
                            </span>
                        </div>

                        {/* delete button */}
                        <div>
                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this product?")) {
                                        fetcher.submit(
                                            { id: product.id },
                                            { method: "post" }
                                        );
                                    }
                                }}
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    padding: "8px 16px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Delete Product
                            </button>
                        </div>

                        {/* Product Images */}
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "12px",
                                marginBottom: "20px",
                            }}
                        >
                            {product.images.nodes.map((img) => (
                                <img
                                    key={img.id || img.url}
                                    src={img.url}
                                    alt={img.altText || product.title}
                                    style={{
                                        width: "110px",
                                        height: "110px",
                                        objectFit: "contain",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "10px",
                                        padding: "6px",
                                        backgroundColor: "#fafafa",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Product Information */}
                        <div
                            style={{
                                backgroundColor: "#f9fafb",
                                padding: "16px",
                                borderRadius: "10px",
                                marginBottom: "20px",
                            }}
                        >
                            <p><strong>Vendor:</strong> {product.vendor}</p>
                            <p><strong>Product Type:</strong> {product.productType}</p>
                            <p><strong>Handle:</strong> {product.handle}</p>
                            <p><strong>Status:</strong> {product.status}</p>
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: "24px", lineHeight: 1.6 }}>
                            <h3 style={{ fontSize: "18px", color: "#111827" }}>
                                Description
                            </h3>

                            <div
                                style={{ color: "#4b5563", overflowWrap: "anywhere" }}
                                dangerouslySetInnerHTML={{
                                    __html: product.descriptionHtml || "No description available",
                                }}
                            />
                        </div>

                        {/* Variants */}
                        <div
                            style={{
                                borderTop: "1px solid #e5e7eb",
                                paddingTop: "18px",
                            }}
                        >
                            <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>
                                Product Variants ({product.variants.nodes.length})
                            </h3>

                            <div style={{ display: "grid", gap: "12px" }}>
                                {product.variants.nodes.map((variant) => (
                                    <div
                                        key={variant.id}
                                        style={{
                                            padding: "16px",
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <h4
                                            style={{
                                                margin: "0 0 14px",
                                                fontSize: "16px",
                                                color: "#2563eb",
                                            }}
                                        >
                                            {variant.title}
                                        </h4>

                                        <p>
                                            <strong>Price:</strong>{" "}
                                            <span style={{ color: "#047857", fontWeight: "bold" }}>
                                                {variant.price != null
                                                    ? `$${variant.price}`
                                                    : "N/A"}
                                            </span>
                                        </p>

                                        <p>
                                            <strong>Compare at Price:</strong>{" "}
                                            {variant.compareAtPrice != null
                                                ? `$${variant.compareAtPrice}`
                                                : "N/A"}
                                        </p>

                                        <p><strong>SKU:</strong> {variant.sku || "N/A"}</p>

                                        <p>
                                            <strong>Inventory Policy:</strong>{" "}
                                            {variant.inventoryPolicy}
                                        </p>

                                        <p>
                                            <strong>Requires Shipping:</strong>{" "}
                                            {variant.requiresShipping ? "Yes" : "No"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>


    )
}

export default Products