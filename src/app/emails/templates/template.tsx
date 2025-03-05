import { Section, Row, Text, Column, Link, Img, Html, Tailwind } from "@react-email/components";

const Template = () => {
    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Section className="my-[16px]">
                    <Section className="mt-[42px]">
                        <Row>
                            <Text className="m-0 text-[16px] font-semibold leading-[24px] text-indigo-600">
                                Our products
                            </Text>
                            <Text className="m-0 mt-[8px] text-[24px] font-semibold leading-[32px] text-gray-900">
                                Elegant Style
                            </Text>
                            <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500">
                                We spent two years in development to bring you the next generation of
                                our award-winning home brew grinder. From the finest pour-overs to the
                                coarsest cold brews, your coffee will never be the same again.
                            </Text>
                        </Row>
                    </Section>
                    <Section className="mt-[16px]">
                        <Row className="mt-[16px] text-center">
                            <Column className="w-full">
                                <div className="mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
                                    <Link href="#">
                                        <Img
                                            alt="Stagg Electric Kettle"
                                            className="rounded-[12px] object-cover"
                                            height={400}
                                            width="100%"
                                            src="https://react.email/static/stagg-eletric-kettle.jpg"
                                            style={{
                                                maxWidth: '400px',
                                                aspectRatio: '1/1',
                                                display: 'block',
                                                margin: '0 auto'
                                            }}
                                        />
                                    </Link>
                                </div>
                            </Column>
                        </Row>
                        <Row className="mt-[16px] text-center">
                            <Column className="w-full">
                                <div className="mx-auto" style={{ maxWidth: '400px', width: '100%' }}>
                                    <Link href="#">
                                        <Img
                                            alt="Ode Grinder"
                                            className="rounded-[12px] object-cover"
                                            height={400}
                                            width="100%"
                                            src="https://react.email/static/ode-grinder.jpg"
                                            style={{
                                                maxWidth: '400px',
                                                aspectRatio: '1/1',
                                                display: 'block',
                                                margin: '0 auto'
                                            }}
                                        />
                                    </Link>
                                </div>
                            </Column>
                        </Row>
                        <Row className="mt-[16px]">
                            <Column className="w-[50%] pr-[8px]">
                                <Link href="#">
                                    <Img
                                        alt="Atmos Vacuum Canister"
                                        className="w-full rounded-[12px] object-cover"
                                        height={400}
                                        src="https://react.email/static/atmos-vacuum-canister.jpg"
                                    />
                                </Link>
                            </Column>
                            <Column className="w-[50%] pl-[8px]">
                                <Link href="#">
                                    <Img
                                        alt="Clyde Electric Kettle"
                                        className="w-full rounded-[12px] object-cover"
                                        height={400}
                                        src="https://react.email/static/clyde-electric-kettle.jpg"
                                    />
                                </Link>
                            </Column>
                        </Row>
                    </Section>
                </Section>
            </Tailwind>
            <Section style={{ textAlign: 'center' }}>
                <table style={{ width: '100%' }}>
                    <tr style={{ width: '100%' }}>
                        <td align="center">
                            <Img
                                alt="React Email logo"
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
                                Acme corporation
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
                                Think different
                            </Text>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <Row
                                style={{
                                    display: 'table-cell',
                                    height: 44,
                                    width: 56,
                                    verticalAlign: 'bottom',
                                }}
                            >
                                <Column style={{ paddingRight: 8 }}>
                                    <Link href="#">
                                        <Img
                                            alt="Facebook"
                                            height="36"
                                            src="https://react.email/static/facebook-logo.png"
                                            width="36"
                                        />
                                    </Link>
                                </Column>
                                <Column style={{ paddingRight: 8 }}>
                                    <Link href="#">
                                        <Img alt="X" height="36" src="https://react.email/static/x-logo.png" width="36" />
                                    </Link>
                                </Column>
                                <Column>
                                    <Link href="#">
                                        <Img
                                            alt="Instagram"
                                            height="36"
                                            src="https://react.email/static/instagram-logo.png"
                                            width="36"
                                        />
                                    </Link>
                                </Column>
                            </Row>
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
                                123 Main Street Anytown, CA 12345
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
                                mail@example.com +123456789
                            </Text>
                        </td>
                    </tr>
                </table>
            </Section>
        </Html>
    );
};
export default Template