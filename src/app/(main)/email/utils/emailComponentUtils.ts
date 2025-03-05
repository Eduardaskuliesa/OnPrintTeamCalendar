// Default props for email components
export const getDefaultProps = (type) => {
    switch (type) {
        case 'header':
            return {
                title: 'Our products',
                subtitle: 'Elegant Style',
                description: 'We spent two years in development to bring you the next generation of our award-winning products.'
            };
        case 'text':
            return {
                content: 'Add your text content here. This is a paragraph that can be edited.'
            };
        case 'image':
            return {
                src: 'https://react.email/static/ode-grinder.jpg',
                alt: 'Product Image',

            };
        case 'button':
            return {
                text: 'Click Me',
                url: '#',
                color: 'indigo-600'
            };
        case 'divider':
            return {
                color: 'gray-300',
                margin: 16
            };
        case 'columns2':
            return {
                leftSrc: 'https://react.email/static/atmos-vacuum-canister.jpg',
                leftAlt: 'Left Image',
                rightSrc: 'https://react.email/static/clyde-electric-kettle.jpg',
                rightAlt: 'Right Image'
            };
        case 'columns3':
            return {
                col1Src: 'https://react.email/static/stagg-eletric-kettle.jpg',
                col1Alt: 'Image 1',
                col2Src: 'https://react.email/static/ode-grinder.jpg',
                col2Alt: 'Image 2',
                col3Src: 'https://react.email/static/atmos-vacuum-canister.jpg',
                col3Alt: 'Image 3'
            };
        case 'footer':
            return {
                companyName: 'Acme Corporation',
                tagline: 'Think different',
                address: '123 Main Street Anytown, CA 12345',
                contact: 'mail@example.com +123456789'
            };
        default:
            return {};
    }
};