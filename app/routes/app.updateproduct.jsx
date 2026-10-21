import { useFetcher, useLoaderData } from 'react-router';
import { authenticate } from '../shopify.server'
import React, { useState } from 'react'

// we use loader function to get the products here then we will update them
export async function loader({ request }) {
    //authenticate the shopify admin store 
    const { admin } = await authenticate.admin(request);
    // api to get the products 
    const getproducts = await admin.graphql(
        `
        #graphql
        query Get_products{
            products(first: 5){
                nodes{
                    id
                    title
                    vendor
                    productType
                    status

                    images (first: 1){
                        nodes{
                            url
                            id
                            altText
                        }
                    }
                }
            }
        }
        `
    )
    // convert the api response to json foramt 
    const result = await getproducts.json();
    // return the products to the page 
    return {
        // later we can get this data with useloaderdata to show listing we get product obj
        products: result.data.products.nodes
    }
}
// NOW step - 2 update the data 

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const formData = await request.formData();

  const id = formData.get("id");
  const title = String(formData.get("title") || "").trim();
  const vendor = String(formData.get("vendor") || "").trim();
  const productType = String(formData.get("productType") || "").trim();
  const status = formData.get("status");

  // Check what the form submitted
  console.log("Submitted product data:", {
    id,
    title,
    vendor,
    productType,
    status,
  });

  if (!id || !title) {
    return { error: "Product ID and title are required" };
  }

  const response = await admin.graphql(
    `#graphql
      mutation UpdateProduct($product: ProductUpdateInput!) {
        productUpdate(product: $product) {
          product {
            id
            title
            vendor
            productType
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        product: {
          id: String(id),
          title,
          vendor,
          productType,
          status,
        },
      },
    }
  );

  const result = await response.json();


  if (result.errors?.length) {
    return {
      error: result.errors.map((e) => e.message).join(", "),
    };
  }

  const updateResult = result.data?.productUpdate;

  if (updateResult.userErrors.length > 0) {
    return {
      error: updateResult.userErrors
        .map((e) => e.message)
        .join(", "),
    };
  }

  return {
    success: true,
    product: updateResult.product,
  };
}

function Updateproduct() {
    const { products } = useLoaderData();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [show, setshow] = useState(false) // to show or hide the update form 
    // update function to get the product id 
    const Updateproduct = (product) => {
        setSelectedProduct(product);
        setshow(true)
        console.log(product)
    }
    // button and field styling
    const buttonStyle = {
        padding: "10px 14px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#171717",
        color: "#fff",
        fontSize: "13px",
        cursor: "pointer",
    };
    const labelStyle = {
        display: "block",
        fontSize: "13px",
        fontWeight: "500",
        marginBottom: "8px",
        color: "#404040",
    };

    const inputStyle = {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #d4d4d4",
        borderRadius: "8px",
        fontSize: "14px",
        backgroundColor: "#fff",
        color: "#171717",
    };
    // use to get the form data after submit 
    // Featcher get the response result avlible in fetcher
    const fetcher = useFetcher()
    return (
        <div>Updateproduct page
            {/* //show the exixsting items */}
            <div style={{
                maxWidth: "1200px",
                margin: "40px auto",
                padding: "24px",
                fontFamily: "Inter, Arial, sans-serif",
                color: "#171717",
                backgroundColor: "#ffffff"
            }}>
                <p style={{
                    fontSize: "12px",
                    color: "#737373",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    marginBottom: "8px"
                }}>
                    Product catalog
                </p>

                <h1 style={{
                    fontSize: "28px",
                    fontWeight: "600",
                    letterSpacing: "-0.8px",
                    marginBottom: "8px"
                }}>
                    My Shopify Products
                </h1>

                <p style={{
                    fontSize: "14px",
                    color: "#737373",
                    marginBottom: "32px"
                }}>
                    Showing {Math.min(products.length, 5)} products for testing
                </p>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "24px"
                }}>
                    {products.slice(0, 5).map((product) => (
                        <div
                            key={product.id}
                            style={{
                                border: "1px solid #e5e5e5",
                                borderRadius: "12px",
                                overflow: "hidden",
                                backgroundColor: "#fff",
                                transition: "box-shadow 0.2s ease"
                            }}
                        >
                            <div style={{
                                width: "100%",
                                aspectRatio: "1 / 1",
                                backgroundColor: "#f5f5f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden"
                            }}>
                                {product.images.nodes[0] ? (
                                    <img
                                        src={product.images.nodes[0].url}
                                        alt={
                                            product.images.nodes[0].altText ||
                                            product.title
                                        }
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover"
                                        }}
                                    />
                                ) : (
                                    <span style={{
                                        fontSize: "13px",
                                        color: "#a3a3a3"
                                    }}>
                                        No image available
                                    </span>
                                )}
                            </div>

                            <div style={{ padding: "16px" }}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: "8px",
                                    marginBottom: "12px"
                                }}>
                                    <h3 style={{
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        lineHeight: "1.5",
                                        margin: 0
                                    }}>
                                        {product.title}
                                    </h3>

                                    <span style={{
                                        fontSize: "10px",
                                        fontWeight: "600",
                                        padding: "4px 7px",
                                        borderRadius: "20px",
                                        backgroundColor:
                                            product.status === "ACTIVE"
                                                ? "#dcfce7"
                                                : "#f5f5f5",
                                        color:
                                            product.status === "ACTIVE"
                                                ? "#166534"
                                                : "#737373",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {product.status}
                                    </span>
                                </div>

                                <p style={{
                                    fontSize: "12px",
                                    color: "#737373",
                                    margin: "0 0 8px",
                                    wordBreak: "break-all"
                                }}>
                                    ID: {product.id}
                                </p>

                                <div style={{
                                    borderTop: "1px solid #f0f0f0",
                                    paddingTop: "12px",
                                    marginTop: "12px"
                                }}>
                                    <p style={{
                                        fontSize: "13px",
                                        margin: "0 0 6px"
                                    }}>
                                        <span style={{ color: "#737373" }}>
                                            Vendor:
                                        </span>{" "}
                                        {product.vendor || "—"}
                                    </p>

                                    <p style={{
                                        fontSize: "13px",
                                        margin: 0
                                    }}>
                                        <span style={{ color: "#737373" }}>
                                            Type:
                                        </span>{" "}
                                        {product.productType || "—"}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => Updateproduct(product)}
                                        style={{
                                            ...buttonStyle,
                                            width: "100%",
                                        }}
                                    >
                                        Update Product
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {show ?
                <div style={{
                    maxWidth: "500px",
                    margin: "30px auto",
                    padding: "24px",
                    border: "1px solid #e5e5e5",
                    borderRadius: "12px",
                    fontFamily: "Inter, Arial, sans-serif",
                    backgroundColor: "#fff"
                }}>
                    <h2 style={{
                        fontSize: "22px",
                        marginBottom: "8px",
                        color: "#171717"
                    }}>
                        Update Product
                    </h2>

                    <p style={{
                        fontSize: "13px",
                        color: "#737373",
                        marginBottom: "24px"
                    }}>
                        Edit your product details below.
                    </p>

                    <fetcher.Form method="post">
                        <input
                            type="hidden"
                            name="id"
                            value={selectedProduct.id}
                        />

                        <div style={{ marginBottom: "18px" }}>
                            <label style={labelStyle}>
                                Product Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={selectedProduct.title}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "18px" }}>
                            <label style={labelStyle}>
                                Vendor
                            </label>
                            <input
                                type="text"
                                name="vendor"
                                defaultValue={selectedProduct.vendor || ""}
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "18px" }}>
                            <label style={labelStyle}>
                                Product Type
                            </label>
                            <input
                                type="text"
                                name="productType"
                                defaultValue={selectedProduct.productType || ""}
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={labelStyle}>
                                Product Status
                            </label>
                            <select
                                name="status"
                                defaultValue={selectedProduct.status}
                                style={inputStyle}
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="DRAFT">Draft</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>

                        <div style={{
                            display: "flex",
                            gap: "12px"
                        }}>
                            <button
                                type="submit"
                                disabled={fetcher.state !== "idle"}
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    border: "none",
                                    borderRadius: "8px",
                                    backgroundColor: "#171717",
                                    color: "#fff",
                                    cursor: "pointer"
                                }}
                            >
                                {fetcher.state !== "idle"
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setshow(false);
                                    setSelectedProduct(null);
                                }}
                                style={{
                                    padding: "12px 18px",
                                    border: "1px solid #e5e5e5",
                                    borderRadius: "8px",
                                    backgroundColor: "#fff",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </fetcher.Form>
                </div>
                : <h2> Hide upadete the page </h2>}

        </div>
    )
}

export default Updateproduct