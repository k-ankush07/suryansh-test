import React from 'react'
import { authenticate } from "../shopify.server";
import { useFetcher } from 'react-router';


// 2 Action to create products // title , id description ,image 
export async function action({ request }) {
    const { admin } = await authenticate.admin(request)
    const formData = await request.formData()
    const title = String(formData.get("title") || "").trim(); // if title is null then "" so its remain string
    const description = String(formData.get("description") || "").trim();
    const sizeInput = String(formData.get("sizes") || "");
    const image = formData.get("productImage");


    if (!title) {
        return { error: "Product title is required." };
    }
    // validate image 
    // Validate the selected image
    const hasImage =
        image &&
        typeof image === "object" &&
        typeof image.size === "number" &&
        image.size > 0;

    if (
        hasImage &&
        (!image.type.startsWith("image/") || image.size > 10 * 1024 * 1024)
    ) {
        return {
            error: "Please select a valid image smaller than 10 MB.",
        };
    }
    // change description format 
    const descriptionHtml = description
        ? `<p>${description.replace(/[&<>"]/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
        }[char]))}</p>`
        : "";

    // sizes 
    const sizes = sizeInput
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);

    // validate the size and prices
    if (sizes.length === 0) {
        return {
            error: "Enter atleast one  size.",
        };
    }
    let imageUrl = null
    //upload trhe image to shopify stagged 
    if (hasImage) {
        const stagedResponse = await admin.graphql(
            `#graphql
    mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters {
            name
            value
          }
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
                    input: [
                        {
                            filename: image.name,
                            mimeType: image.type,
                            httpMethod: "POST",
                            resource: "PRODUCT_IMAGE",
                        },
                    ],
                },
            }
        );
        const stagedResult = await stagedResponse.json();
        const stagedData = stagedResult.data?.stagedUploadsCreate;

        //check for error if shopify sends error 
        if (stagedResult.errors || stagedData?.userErrors?.length) {
            return {
                error:
                    stagedResult.errors?.map((e) => e.message).join(", ") ||
                    stagedData.userErrors.map((e) => e.message).join(", "),
            };
        }
        // get target 
        const target = stagedData?.stagedTargets?.[0]; // target return by shopify caontain info lik e url resource url 
        if (!target) {
            return { error: "Could not prepare the image upload." };
        }
        //create an empty box
        const uploadForm = new FormData();
        // create add graph query  // use muatation when we want to crate and use query when get
        for (const parameter of target.parameters) {
            uploadForm.append(parameter.name, parameter.value);
        }
        uploadForm.append("file", image, image.name); // append add the origial img also 
        // upload the imagedata stired in uploadfrom cinatiner 
        const uploadResponse = await fetch(target.url, {
            method: "POST",
            body: uploadForm,
        })
        // if thier any error in upload
        if (!uploadResponse.ok) {
            return { error: "Failed to upload the product image." };
        }
        imageUrl = target.resourceUrl;
    }
    // ... on MediaImage is query checkfor the graphqi that check media is image 
    try {
        const response = await admin.graphql(
            `#graphql
      mutation CreateProduct(
        $product: ProductCreateInput!
        $media: [CreateMediaInput!]
      ) {
        productCreate(product: $product, media: $media) {
          product {
            id
            title
            variants(first: 1) {
                nodes{
                    id
                    price
                     selectedOptions {
                     name
                     value
                     }
                }
            }
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
                        title,
                        descriptionHtml,
                        status: "DRAFT",
                        productOptions: [
                            {
                                name: "Size",
                                values: sizes.map((size) => ({
                                    name: size
                                }))
                            }
                        ],
                    },
                    media: imageUrl
                        ? [
                            {
                                originalSource: imageUrl,
                                mediaContentType: "IMAGE",
                            },
                        ]
                        : [],
                },
            }
        );
        //get response in js format 
        const result = await response.json();
        console.log("Shopify response:", JSON.stringify(result, null, 2));
        // if any error 
        if (result.errors) {
            return {
                error: result.errors
                    .map((error) => error.message)
                    .join(", "),
            };
        }
        const created = result.data.productCreate
        //check user error
        if (created.userErrors.length > 0) {
            return {
                error: created.userErrors
                    .map((error) => error.message)
                    .join(", "),
            };
        }
        return { product: created.product }
    } catch (error) {
        console.error("GraphQL error:", error.graphQLErrors ?? error.message);
        throw error;
    }

}
function CreateProduct() {
    const fetcher = useFetcher();
    const isSubmitting = fetcher.state !== "idle";
    const product = fetcher.data?.product;
    const error = fetcher.data?.error;
    return (
        <div
            className="create-product-container"
            style={{
                maxWidth: "650px",
                margin: "40px auto",
                padding: "30px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1
                className="create-product-heading"
                style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#1f2937",
                    marginBottom: "25px",
                    textAlign: "center",
                }}
            >
                Create Shopify Product
            </h1>

            {/* Product creation form */}
            <fetcher.Form
                method="post"
                encType="multipart/form-data"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label
                        htmlFor="title"
                        style={{ fontSize: "15px", fontWeight: "600", color: "#374151" }}
                    >
                        Product Title
                    </label>

                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Example: Blue T-shirt"
                        required
                        style={{
                            padding: "12px 14px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "15px",
                            outline: "none",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label
                        htmlFor="description"
                        style={{ fontSize: "15px", fontWeight: "600", color: "#374151" }}
                    >
                        Product Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        placeholder="Describe your product"
                        rows={5}
                        style={{
                            padding: "12px 14px",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "15px",
                            resize: "vertical",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                            width: "100%",
                        }}
                    />
                </div>

                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label
                        htmlFor="productImage"
                        style={{ fontSize: "15px", fontWeight: "600", color: "#374151" }}
                    >
                        Product Image
                    </label>

                    <input
                        id="productImage"
                        type="file"
                        name="productImage"
                        accept="image/*"
                        style={{
                            padding: "12px",
                            border: "1px dashed #9ca3af",
                            borderRadius: "8px",
                            backgroundColor: "#f9fafb",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                    />
                </div>
                <div>
                    <label>
                        Sizes
                        <input
                            type="text"
                            name="sizes"
                            placeholder="Small, Medium, Large"
                            defaultValue="Small, Medium, Large"
                            required
                        />
                    </label>


                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="create-product-button"
                    style={{
                        padding: "14px 20px",
                        backgroundColor: isSubmitting ? "#9ca3af" : "#008060",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        transition: "background-color 0.2s ease",
                        marginTop: "5px",
                    }}
                >
                    {isSubmitting ? "Creating..." : "Create Product"}
                </button>
            </fetcher.Form>

            {/* Show errors */}
            {error && (
                <p
                    className="error-message"
                    role="alert"
                    style={{
                        marginTop: "20px",
                        padding: "12px",
                        color: "#b91c1c",
                        backgroundColor: "#fee2e2",
                        borderRadius: "8px",
                        fontSize: "14px",
                    }}
                >
                    Error: {error}
                </p>
            )}

            {/* Show newly created product */}
            {product && (
                <section
                    className="product-success"
                    style={{
                        marginTop: "25px",
                        padding: "20px",
                        backgroundColor: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        borderRadius: "10px",
                        color: "#065f46",
                    }}
                >
                    <h2 style={{ fontSize: "20px", marginTop: 0, marginBottom: "15px" }}>
                        Product created successfully!
                    </h2>

                    <p style={{ margin: "8px 0" }}>
                        <strong>Title:</strong> {product.title}
                    </p>

                    <p style={{ margin: "8px 0" }}>
                        <strong>Status:</strong> {product.status}
                    </p>

                    <p style={{ margin: "8px 0", overflowWrap: "anywhere" }}>
                        <strong>ID:</strong> {product.id}
                    </p>
                </section>
            )}
        </div>
    )
}

export default CreateProduct