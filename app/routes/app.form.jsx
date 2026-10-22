import React, { useState } from 'react'
import {
    Box,
    BlockStack,
    Button,
    Icon,
    InlineStack,
    Text,
    Divider,
    Badge
} from "@shopify/polaris";

import { AlertCircleIcon } from "@shopify/polaris-icons";
function Form() {
    const steps = [
        {
            id: 'upload-image',
            label: 'Upload an image for your puzzle',
            description:
                'Start by uploading a high-quality image that will be used to create your puzzle. For best results, use images that are at least 1200x1200 pixels.',
            primaryAction: 'Upload image',
            secondaryAction: 'Image requirements',
        },
        {
            id: 'choose-template',
            label: 'Choose a puzzle template',
            description:
                'Select a template for your puzzle - choose between 9-piece (beginner), 16-piece (intermediate), or 25-piece (advanced) layouts.',
            primaryAction: 'Choose template',
            secondaryAction: 'See all templates',
        },
        {
            id: 'customize-pieces',
            label: 'Customize puzzle piece shapes',
            description:
                'Make your puzzle unique by customizing the shapes of individual pieces. Choose from classic, curved, or themed piece styles.',
            primaryAction: 'Customize pieces',
            secondaryAction: 'Learn about piece styles',
        },
        {
            id: 'customize-pieces2',
            label: 'Customize puzzle piece shapes',
            description:
                'Make your puzzle unique by customizing the shapes of individual pieces. Choose from classic, curved, or themed piece styles.',
            primaryAction: 'Customize pieces',
            secondaryAction: 'Learn about piece styles',
        },
    ];

    const templates = [
        { id: '4-piece', name: '4-Pieces', image: 'https://cdn.shopify.com/static/images/polaris/patterns/4-pieces.png' },
        { id: '9-piece', name: '9-Pieces', image: 'https://cdn.shopify.com/static/images/polaris/patterns/9-pieces.png' },
        { id: '16-piece', name: '16-Pieces', image: 'https://cdn.shopify.com/static/images/polaris/patterns/16-pieces.png' },
    ];

    const news = [
        {
            id: 'new-shapes-and-themes',
            date: 'Jan 21, 2025',
            title: 'New puzzle shapes and themes added',
            summary:
                "We've added 5 new puzzle piece shapes and 3 seasonal themes to help you create more engaging and unique puzzles for your customers.",
        },
        {
            id: 'puzzle-difficulty-customization',
            date: 'Nov 6, 2024',
            title: 'Puzzle difficulty customization features',
            summary:
                'Now you can fine-tune the difficulty of your puzzles with new rotation controls, edge highlighting options, and piece recognition settings.',
        },
    ];

    const apps = [
        {
            name: 'Shopify Flow',
            href: 'https://apps.shopify.com/flow',
            icon: 'https://cdn.shopify.com/app-store/listing_images/15100ebca4d221b650a7671125cd1444/icon/CO25r7-jh4ADEAE=.png',
            description: 'Automate everything and get back to business.',
        },
        {
            name: 'Shopify Planet',
            href: 'https://apps.shopify.com/planet',
            icon: 'https://cdn.shopify.com/app-store/listing_images/87176a11f3714753fdc2e1fc8bbf0415/icon/CIqiqqXsiIADEAE=.png',
            description: 'Offer carbon-neutral shipping and showcase your commitment.',
        },
    ];

    const grid = [
        {
            link: "Registration form",
        }
    ]

    const [visible, setVisible] = useState({
        banner: true,
        setupGuide: true,
        calloutCard: true,
        featuredApps: true,
    });
    const [expanded, setExpanded] = useState({});
    const [completed, setCompleted] = useState({});
    const completedCount = steps.filter((step) => completed[step.id]).length;

    return (
        <s-page>
            <s-button slot="primary-action" variant="primary">Create puzzle</s-button>
            <s-button slot="secondary-actions">Browse templates</s-button>
            <s-button slot="secondary-actions">Import image</s-button>

            {/* === */}
            {/* Banner */}
            {/* Use banners sparingly. Only one banner should be visible at a time. */}
            {/* If dismissed, use local storage or a database entry to avoid showing this section again to the same user. */}
            {/* === */}
            {/* Banner */}

            {/* Use banners sparingly. Only one banner should be visible at a time. */}

            {/* If dismissed, use local storage or a database entry to avoid showing this section again to the same user. */}

            {/* === */}

            {visible.banner && (
                <Box
                    background="bg-surface-caution"
                    borderColor="border-caution"
                    borderWidth="025"
                    borderRadius="300"
                    padding="400"
                    marginBlockEnd="400"

                >
                    <InlineStack
                        align="space-between"
                        blockAlign="center"
                        gap="800"
                        wrap={false}
                    >
                        <Box minWidth="0">
                            <InlineStack gap="100">
                                <Icon source={AlertCircleIcon} />
                                <Text variant="bodyMd" fontWeight="semibold">
                                    App embed is off
                                    Your forms won't show on your online store until you
                                    turn on the app embed in your theme.
                                </Text>
                            </InlineStack>
                        </Box>

                        <Box>
                            <Badge tone={"warning"} size='large'>Turn on app embed</Badge>
                        </Box>

                    </InlineStack>
                </Box>
            )}


            {/* === */}
            {/* Setup guide */}
            {/* Keep instructions brief and direct. Only ask merchants for required information. */}
            {/* The header holds the guide's progress in the supplemental slot and its dismiss button in the secondary-actions slot. */}
            {/* Steps sit directly in the card, separated by dividers. A step's details open beneath it, in line with its label, without a box of their own. */}
            {/* If dismissed, use local storage or a database entry to avoid showing this section again to the same user. */}
            {/* === */}
            {visible.setupGuide && (
                <Box paddingBlock="400">
                    <s-section heading="Setup guide" paddingBlockStart="400" >
                        <s-stack gap="base">
                            <InlineStack
                                align="space-between"
                                gap="400">

                                <s-paragraph color="subdued">
                                    Use this personalized guide to get your store ready for sales.
                                </s-paragraph>

                                {/* Inline progress bar */}
                                <InlineStack>
                                    <s-stack direction="inline" gap="base" alignItems="center">
                                        <s-text color="subdued">
                                            {completedCount} of {steps.length} steps completed
                                        </s-text>

                                        <progress
                                            value={completedCount}
                                            max={steps.length || 1}
                                            aria-label="Setup guide progress"
                                            style={{
                                                width: 110,
                                                height: 13,
                                                accentColor: "#1A8754",
                                            }}
                                        />
                                    </s-stack>
                                    <s-button
                                        accessibilityLabel="Dismiss guide"
                                        onClick={() =>
                                            setVisible((previous) => ({
                                                ...previous,
                                                setupGuide: false,
                                            }))
                                        }
                                        variant="tertiary"
                                        icon="x"
                                    />
                                </InlineStack>

                            </InlineStack>



                            {steps.map((step, index) => (
                                <s-stack key={step.id} gap="small">
                                    {index > 0 && <s-divider />}

                                    <s-grid
                                        gridTemplateColumns="1fr auto"
                                        gap="base"
                                        alignItems="center"
                                    >
                                        {/* Circular checkbox */}
                                        <label
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 10,
                                                cursor: "pointer",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    position: "relative",
                                                    display: "inline-flex",
                                                    width: 22,
                                                    height: 22,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    aria-label={step.label}
                                                    checked={Boolean(completed[step.id])}
                                                    onChange={(event) => {
                                                        const checked = event.currentTarget.checked;

                                                        setCompleted((previous) => ({
                                                            ...previous,
                                                            [step.id]: checked,
                                                        }));
                                                    }}
                                                    style={{
                                                        appearance: "none",
                                                        margin: 0,
                                                        width: 22,
                                                        height: 22,
                                                        borderRadius: "50%",
                                                        border: completed[step.id]
                                                            ? "2px solid #303030"
                                                            : "2px dashed #8a8a8a",
                                                        background: completed[step.id]
                                                            ? "#303030"
                                                            : "transparent",
                                                        cursor: "pointer",
                                                    }}
                                                />

                                                {completed[step.id] && (
                                                    <span
                                                        aria-hidden="true"
                                                        style={{
                                                            position: "absolute",
                                                            left: 8,
                                                            top: 4,
                                                            width: 5,
                                                            height: 9,
                                                            border: "solid white",
                                                            borderWidth: "0 2px 2px 0",
                                                            transform: "rotate(45deg)",
                                                            pointerEvents: "none",
                                                        }}
                                                    />
                                                )}
                                            </span>

                                            <span>{step.label}</span>
                                        </label>

                                        <s-button
                                            onClick={() =>
                                                setExpanded((previous) => ({
                                                    ...previous,
                                                    [step.id]: !previous[step.id],
                                                }))
                                            }
                                            accessibilityLabel={`Toggle ${step.label} details`}
                                            variant="tertiary"
                                            icon={
                                                expanded[step.id]
                                                    ? "chevron-up"
                                                    : "chevron-down"
                                            }
                                        />
                                    </s-grid>

                                    {expanded[step.id] && (
                                        <s-grid
                                            gridTemplateColumns="1fr auto"
                                            gap="base"
                                            alignItems="center"
                                            paddingInlineStart="large-200"
                                        >
                                            <s-stack gap="small-200">
                                                <s-paragraph color="subdued">
                                                    {step.description}
                                                </s-paragraph>

                                                <s-stack direction="inline" gap="small-200">
                                                    <s-button variant="primary">
                                                        {step.primaryAction}
                                                    </s-button>

                                                    <s-button variant="tertiary">
                                                        {step.secondaryAction}
                                                    </s-button>
                                                </s-stack>
                                            </s-stack>

                                            <s-box maxBlockSize="80px" maxInlineSize="80px">
                                                <s-image
                                                    src="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                                                    alt=""
                                                />
                                            </s-box>
                                        </s-grid>
                                    )}
                                </s-stack>
                            ))}
                        </s-stack>
                    </s-section>
                </Box>
            )}

            {/* the gridboxes */}
            <s-stack>
                {/* //blockstack align the vertical outer 2 boxes */}
                <BlockStack>
                    <Box>
                        <s-grid
                            gridTemplateColumns="2fr 1fr"
                            gap="base"
                            alignItems="start"
                        >
                            {/* right-side-box */}
                            <Box background="bg-surface" padding="400" borderRadius='200'>
                                <InlineStack align='space-between'>
                                    <s-stack>
                                        <s-heading>Forms</s-heading>
                                        <s-text>Last 7 days · 4 live</s-text>
                                    </s-stack>
                                    {/* button */}
                                    <s-stack direction="inline" gap="small">
                                        <s-button variant="secondary"  >
                                            View all
                                        </s-button>

                                        <s-button variant="primary">
                                            + Create Form
                                        </s-button>
                                    </s-stack>
                                </InlineStack>
                                {/* //grid -with four boxes */}
                                <s-grid gridTemplateColumns="1fr 1fr" gap='base' paddingBlock='base'>
                                    <Box
                                        background="bg-surface-secondary"
                                        padding="300"
                                        borderRadius="300"
                                        minWidth="0"
                                        minHeight="136px"
                                        gap="050"
                                        direction="column"
                                    >
                                        <s-stack direction="inline">
                                            <span>.</span>
                                            <a className="an-link" href="/admin/forms/167670">
                                                Registration form
                                            </a>
                                        </s-stack>

                                        <s-stack direction="inline">
                                            <h4>0</h4>
                                            <s-text>submission</s-text>
                                        </s-stack>

                                        <s-stack direction="inline">
                                            <h4>0</h4>
                                            <s-text variant="heading-sm" color="base">
                                                Views and analytic trend</s-text>
                                        </s-stack>
                                    </Box>

                                    <Box background='bg-surface-secondary'
                                        padding="300"
                                        radius="300"
                                        minWidth="0"
                                        minHeight="136px"
                                        gap="050"
                                        direction="column">
                                        <s-stack direction="inline">
                                            <span>.</span>
                                            <a className="an-link" href="/admin/forms/167670">
                                                Registration form
                                            </a>
                                        </s-stack>

                                        <s-stack direction="inline">
                                            <h4>0</h4>
                                            <s-text>submission</s-text>
                                        </s-stack>

                                        <s-stack direction="inline">
                                            <h4>0</h4>
                                            <s-text>Views and analytic trend</s-text>
                                        </s-stack>
                                    </Box>
                                    <Box
                                        background="bg-surface-secondary"
                                        padding="300"
                                        radius="300"
                                        minWidth="0"
                                        minHeight="136px"
                                        gap="050"
                                        direction="column"
                                    >
                                        <s-stack direction="inline">
                                            <span>.</span>
                                            <a className="an-link" href="/admin/forms/167670">
                                                Registration form
                                            </a>
                                        </s-stack>

                                        <s-stack direction="inline">
                                            <h4>0</h4>
                                            <s-text>submission</s-text>
                                        </s-stack>

                                        <s-stack direction="inline">
                                            <h4>0</h4>
                                            <s-text>Views and analytic trend</s-text>
                                        </s-stack>
                                    </Box>
                                    <Box
                                        background="bg-surface-secondary"
                                        padding="300"
                                        radius="300"
                                        minWidth="0"
                                        minHeight="136px"
                                        gap="050"
                                        direction="column"
                                    >
                                        <s-stack direction="inline">
                                            <span>.</span>
                                            <a className="an-link" href="/admin/forms/167670">
                                                Registration form
                                            </a>
                                        </s-stack>

                                        <s-stack direction="inline">
                                            <h4>0</h4>
                                            <s-text>submission</s-text>
                                        </s-stack>

                                        <s-stack direction="inline">
                                            <h4>0</h4>
                                            <s-text>Views and analytic trend</s-text>
                                        </s-stack>
                                    </Box>
                                </s-grid>
                                <Divider />

                                <InlineStack align="space-between"
                                    gap="400" >
                                    <Box minWidth="0" paddingBlockStart="300">
                                        <InlineStack>
                                            <Icon source={AlertCircleIcon} tone="subdued" />
                                            <Text variant="">
                                                No new submissions since your last visit · latest 14 days ago
                                            </Text>
                                        </InlineStack>
                                    </Box>

                                    <Box paddingBlockStart="300" >
                                        <Button
                                            url="/app/upgrade"
                                            variant="warning"
                                            tone="warning"
                                        >
                                            view submisssion
                                        </Button>
                                    </Box>
                                </InlineStack>
                            </Box>
                            {/* left-box with 2 boex alin vertial */}
                            <Box >
                                <BlockStack gap="400">
                                    <Box
                                        padding="300"
                                        background="bg-surface"
                                        border="base"
                                        borderRadius="300"

                                    >
                                        <Box paddingBlockEnd="300">
                                            <InlineStack
                                                blockAlign="center"
                                                align="space-evenly"
                                                gap="400"

                                            >
                                                <s-heading>Storefront status</s-heading>

                                                <Badge tone={"warning"}>Action Needed</Badge>

                                                <Icon source={AlertCircleIcon} tone="subdued" />
                                            </InlineStack>
                                        </Box>

                                        <Divider />
                                        <Box paddingBlock={300}>
                                            <s-grid gridTemplateColumns="1fr 1fr" gap="base" alignItems="stretch" paddingBlock='300'>
                                                {/* Box 1 */}
                                                <Box
                                                    background="bg-surface-critical"
                                                    padding="300"
                                                    borderRadius="300"
                                                >
                                                    <s-text>App embed</s-text>
                                                    <s-stack direction="inline" gap="small" alignItems="center">
                                                        <s-text tone="critical" style={{ fontSize: "20px", fontWeight: "bold" }}>
                                                            •
                                                        </s-text>
                                                        <s-text color="critical" tone='critical'>Off</s-text>
                                                    </s-stack>
                                                    <s-text>Popups hidden</s-text>
                                                    <Button variant="primary">Turn on</Button>
                                                </Box>

                                                {/* Box 2 */}
                                                <Box background="bg-surface-secondary" padding="300" borderRadius="300" >
                                                    <s-text>Theme Block</s-text>
                                                    <s-stack direction="inline" gap="small" alignItems="center">
                                                        <s-text tone="secondary" style={{ fontSize: "20px", fontWeight: "bold" }}>
                                                            •
                                                        </s-text>
                                                        <s-text color="critical" type='strong' style={{ fontWeight: "bold" }}>Not added</s-text>
                                                    </s-stack>
                                                    <s-text>Optional</s-text>
                                                    <Button>Add Block</Button>
                                                </Box>
                                            </s-grid>
                                        </Box>
                                    </Box>


                                    <s-section heading="Left box 3">
                                        <s-paragraph>Additional left section</s-paragraph>
                                    </s-section>

                                </BlockStack>
                            </Box>
                        </s-grid>
                    </Box>

                    <Box paddingBlock="300">
                        <s-grid gridTemplateColumns='2fr 1fr' gap='base'>
                            <Box background="bg-surface" padding="400" borderRadius='200'>
                                {/* UPPER-set */}
                                <InlineStack align='space-between' >
                                    <BlockStack>
                                        <s-stack direction='inline' gap='base'>
                                            <s-text>Usage</s-text>
                                            <Badge tone="subdued" variant='strong'> Free </Badge>
                                        </s-stack>
                                        <Box paddingBlock={200}>
                                            <s-text>Resets Nov 1 · 10 days left</s-text>
                                        </Box>
                                    </BlockStack>
                                    <a className="an-link" href="/admin/forms"
                                        style={{
                                            textDecoration: "none",
                                            color: "#4e7fe9",
                                        }}>
                                        Upgrade Plan
                                    </a>
                                </InlineStack>
                                {/* lower */}
                                <Divider />

                                <s-grid
                                    gridTemplateColumns="1fr auto 1fr"
                                    gap="large"
                                    alignItems="stretch"
                                >
                                    {/* Submissions */}
                                    <Box paddingBlock="400">
                                        <BlockStack>
                                            <InlineStack align="space-between">
                                                <s-text>Submissions</s-text>
                                                <s-text>2 / 40 this billing cycle</s-text>
                                            </InlineStack>

                                            <s-progress value={10} max={100} />

                                            <s-text>38 left this cycle</s-text>
                                        </BlockStack>
                                    </Box>

                                    {/* Vertical divider */}
                                    <Box
                                        background="border"
                                        minWidth="1px"
                                    />

                                    {/* Storage */}
                                    <Box paddingBlock="400">
                                        <BlockStack>
                                            <InlineStack align="space-between">
                                                <s-text>Storage</s-text>
                                                <s-text>0 MB / 200 MB</s-text>
                                            </InlineStack>

                                            <s-progress value={0} max={100} />

                                            <s-text>Nothing stored yet</s-text>
                                        </BlockStack>
                                    </Box>
                                </s-grid>

                            </Box >

                            <Box background="bg-surface" padding="400" borderRadius='200'>
                                <InlineStack blockAlign='center' align='space-between'>
                                    <s-text>Need a hand?</s-text>
                                    <s-text>images</s-text>
                                </InlineStack>
                                <s-text>Emma + 2 online · ~2 min</s-text>
                                <s-text>reply</s-text>
                                <InlineStack>
                                    <s-text>*</s-text>
                                    <s-text>Free setup — we'll build a form or match it to your theme.</s-text>
                                </InlineStack>
                                {/* buttons */}
                                <Box paddingBlock={400}>
                                    <InlineStack gap="200" >
                                        <Badge tone="subdued"> 💬 Chat with us </Badge>
                                        <Button >Email us </Button>
                                    </InlineStack>
                                </Box>

                            </Box>
                        </s-grid>
                    </Box>
                </BlockStack>

            </s-stack>
            {/* Footer help */}
            <s-stack alignItems="center" paddingBlock="large">

                <s-text color="subdued">
                    Learn more about <s-link href="https://help.shopify.com" target="_blank">creating engaging puzzles</s-link>.
                </s-text>
            </s-stack>
        </s-page>
    )
}

export default Form