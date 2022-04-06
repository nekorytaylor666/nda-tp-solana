## General

Test project for NDA company. The project is a token creation platform.

Features:

- SPL-token creation on DEVNET
- Adding automatic pull request to Solana token registry

How to set up?
Just clone the project and install all dependencies.
For automatic PR, you should add a github access token. You can do it here https://github.com/settings/tokens.
Copy-paste it to .env file as GITHUB_AUTH_STRING.

Problems I encountered and how I managed them:

- I created all the tokens without any problem when paying fees and signing with keypairs from Keypair.generate(). Because I had access to the private key. And all @solana/spl-token library methods are using Keypair with the private key as payer. It was confusing to figure out how to use the phantom wallet to sign and pay fees for transactions. Since ordinary wallets don't have access to private keys, I rewrote all minting methods from the spl-token library to use a phantom wallet as a signer and payer of the fees. It took a good chunk of time, but now you can create tokens without creating a different wallet for paying transcation fees and signing transactions.
-
- Chakra. I wanted to use chakra for a long time. I had experience with Tailwind CSS projects, and at every project, you are starting to build your component library. Tailwind takes a lot of boilerplate code to make a strong typed and flexible design system. But with chakra those problems are already solved. Chakra Feels like Tailwind and Material UI.

## Available Scripts

### Running the development server.

```bash
    yarn dev
```

### Building for production.

```bash
    yarn build
```

### Running the production server.

```bash
    yarn start
```

## Learn More

To learn more about **superplate**, please check out the [Documentation](https://github.com/pankod/superplate).

### **Chakra UI**

Chakra UI is a simple, modular and accessible component library that gives you the building blocks you need to build your React applications.

[Go To Documentation](https://chakra-ui.com/docs/getting-started)

### **Styled Components**

Utilising tagged template literals (a recent addition to JavaScript) and the power of CSS, styled-components allows you to write actual CSS code to style your components.

[Go To Documentation](https://styled-components.com/docs)

### **Axios**

Promise based HTTP client for the browser and node.js.

[Go To Documentation](https://github.com/axios/axios)

### **SVGR**

Transform SVGs into React components.

[Go To Documentation](https://react-svgr.com/docs/getting-started/)

### **Environment Variables**

Use environment variables in your next.js project for server side, client or both.

[Go To Documentation](https://github.com/vercel/next.js/tree/canary/examples/environment-variables)

### **React Query**

Hooks for fetching, caching and updating asynchronous data in React.

[Go To Documentation](https://react-query.tanstack.com/overview)

### **Recoil**

Recoil works and thinks like React. Add some to your app and get fast and flexible shared state.

[Go To Documentation](https://recoiljs.org/docs/introduction/installation)

### **ESLint**

A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript. Maintain your code quality with ease.

[Go To Documentation](https://eslint.org/docs/user-guide/getting-started)

### **Prettier**

An opinionated code formatter; Supports many languages; Integrates with most editors.

[Go To Documentation](https://prettier.io/docs/en/index.html)

### **Testing Library**

The React Testing Library is a very light-weight solution for testing React components. It provides light utility functions on top of react-dom and react-dom/test-utils.

[Go To Documentation](https://testing-library.com/docs/)

### **Cypress**

Fast, easy and reliable testing for anything that runs in a browser.

[Go To Documentation](https://docs.cypress.io/guides/overview/why-cypress.html)

### **Docker**

Docker simplifies and accelerates your workflow, while giving developers the freedom to innovate with their choice of tools, application stacks, and deployment environments for each project.

[Go To Documentation](https://www.docker.com/get-started)

## License

MIT
