import React from 'react';
import { Section, Row, Text, Column, Link, Img, Html, Tailwind } from "@react-email/components";

const EmailTemplate = ({ emailComponents }) => {
    // Render individual components based on their type
    const renderComponent = (component) => {
        const { type, props, id } = component;

        switch (type) {
            case 'header':
                return (
                    <Section key={id} className="mt-[42px]">
                        <Row>
                            <Text className="m-0 text-[16px] font-semibold leading-[24px] text-indigo-600">
                                {props.title}
                            </Text>
                            <Text className="m-0 mt-[8px] text-[24px] font-semibold leading-[32px] text-gray-900">
                                {props.subtitle}
                            </Text>
                            <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
                                {props.description}
                            </Text>
                        </Row>
                    </Section>
                );

            case 'text':
                return (
                    <Section key={id} className="mt-[16px]">
                        <Row>
                            <Text className="text-[16px] leading-[24px] text-gray-700">
                                {props.content}
                            </Text>
                        </Row>
                    </Section>
                );

            case 'image':
                return (
                    <Section key={id} className="mt-[16px]">
                        <Row className="text-center">
                            <Column className="w-full">
                                <Link href="#">
                                    <Img
                                        alt={props.alt}
                                        className="rounded-[12px] object-cover"
                                        height={400}
                                        width="100%"
                                        src={props.src}
                                    />
                                </Link>
                            </Column>
                        </Row>
                    </Section>
                );

            case 'button':
                return (
                    <Section key={id} className="mt-[16px] text-center">
                        <Link
                            href={props.url}
                            className={`inline-block px-6 py-3 bg-${props.color} text-white font-medium rounded-md`}
                        >
                            {props.text}
                        </Link>
                    </Section>
                );

            case 'divider':
                return (
                    <Section key={id} className={`mt-[${props.margin}px]`}>
                        <div className={`h-px w-full bg-${props.color}`}></div>
                    </Section>
                );

            case 'columns2':
                return (
                    <Section key={id} className="mt-[16px]">
                        <Row className="mt-[16px]">
                            <Column className="w-[50%] pr-[8px]">
                                <Link href="#">
                                    <Img
                                        alt={props.leftAlt}
                                        className="w-full rounded-[12px] object-cover"
                                        height={400}
                                        src={props.leftSrc}
                                    />
                                </Link>
                            </Column>
                            <Column className="w-[50%] pl-[8px]">
                                <Link href="#">
                                    <Img
                                        alt={props.rightAlt}
                                        className="w-full rounded-[12px] object-cover"
                                        height={400}
                                        src={props.rightSrc}
                                    />
                                </Link>
                            </Column>
                        </Row>
                    </Section>
                );

            case 'footer':
                return (
                    <Section key={id} style={{ textAlign: 'center' }} className="mt-[32px]">
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr style={{ width: '100%' }}>
                                    <td align="center">
                                        <Img
                                            alt="Logo"
                                            height="42"
                                            src="https://react.email/static/logo-without-background.png"
                                        />
                                    </td>
                                </tr>
                                <tr style={{ width: '100%' }}>
                                    <td align="center">
                                        <Text
                                            style={{
                                                marginTop: 8,
                                                marginBottom: 8,
                                                fontSize: 16,
                                                lineHeight: '24px',
                                                fontWeight: 600,
                                                color: 'rgb(17,24,39)',
                                            }}
                                        >
                                            {props.companyName}
                                        </Text>
                                        <Text
                                            style={{
                                                marginTop: 4,
                                                marginBottom: '0px',
                                                fontSize: 16,
                                                lineHeight: '24px',
                                                color: 'rgb(107,114,128)',
                                            }}
                                        >
                                            {props.tagline}
                                        </Text>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <Text
                                            style={{
                                                marginTop: 8,
                                                marginBottom: 8,
                                                fontSize: 16,
                                                lineHeight: '24px',
                                                fontWeight: 600,
                                                color: 'rgb(107,114,128)',
                                            }}
                                        >
                                            {props.address}
                                        </Text>
                                        <Text
                                            style={{
                                                marginTop: 4,
                                                marginBottom: '0px',
                                                fontSize: 16,
                                                lineHeight: '24px',
                                                fontWeight: 600,
                                                color: 'rgb(107,114,128)',
                                            }}
                                        >
                                            {props.contact}
                                        </Text>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Section>
                );

            default:
                return null;
        }
    };

    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Section className="my-[16px]">
                    {emailComponents.map(component => renderComponent(component))}

                    {emailComponents.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <p>Select components from the palette to build your email</p>
                        </div>
                    )}
                </Section>
            </Tailwind>
        </Html>
    );
};

export default EmailTemplate;