const pureHighlighter = require("../website/pureHighlighter");

module.exports = {
  title: "Legend",
  tagline:
    "Language and visual platform to generate models for the financial services industry",
  url: "https://legend.finos.org/",
  baseUrl: "/",
  organizationName: "finos",
  deploymentBranch: "gh-pages",
  trailingSlash: false,
  projectName: "legend",
  scripts: ["https://buttons.github.io/buttons.js"],
  stylesheets: [
    "https://fonts.googleapis.com/css?family=Roboto+Condensed:400,500,700,900|Source+Code+Pro:400,500,700,900&display=swap",
  ],
  favicon: "img/favicon/favicon.ico",
  customFields: {
    wrapPagesHTML: true,
    repoUrl: "https://github.com/finos/legend/",
    highlight: {
      theme: "tomorrow-night-blue",
      hljs: function (hljsEngine) {
        hljsEngine.registerLanguage("legend", pureHighlighter);
      },
    },
  },
  onBrokenLinks: process.env.NODE_ENV === "production" ? "throw" : "warn",
  onBrokenMarkdownLinks:
    process.env.NODE_ENV === "production" ? "throw" : "warn",
  onDuplicateRoutes: process.env.NODE_ENV === "production" ? "throw" : "warn",
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "../docs",
          //svp
          breadcrumbs: false /* hide collapsed nav bar header because we only have 1 parent now which is Getting Started*/,
          sidebarPath: "../website/sidebars.json",
        },
        blog: {},
        theme: {
          customCss: "./src/css/customTheme.css",
        },
        googleAnalytics: {
          trackingID: "UA-89349362-7",
        },
      },
    ],
  ],
  plugins: [
    async function myPlugin(context, options) {
      // ...
      return {
        name: "docusaurus-releases-plugin",
        async loadContent() {
          const path = require("path");
          const fs = require("fs");
          const releases = fs
            .readdirSync(path.resolve(__dirname, "../releases"))
            .map((dir) => {
              console.log(dir);
              const fullDir = path.resolve(__dirname, `../releases/${dir}`);
              if (!fs.lstatSync(fullDir).isDirectory()) {
                return undefined;
              }
              return require(`${fullDir}/manifest.json`);
            })
            .filter(Boolean);
          return releases;
        },
        async contentLoaded({ content, actions }) {
          const { createData, addRoute } = actions;
          const releaseJSONPath = await createData(
            "releasesData.json",
            JSON.stringify(content)
          );
          // Add the '/releases' routes, and ensure it receives the releases props
          addRoute({
            path: "/releases",
            component: "@site/src/components/releases.js",
            modules: {
              releasesData: releaseJSONPath,
            },
            exact: true,
          });
        },
      };
    },
  ],
  themeConfig: {
    // prism: {
    //   theme: require("prism-react-renderer/themes/github"),
    // },
    algolia: {
      // The application ID provided by Algolia
      appId: "X69JR631XX",
      apiKey: "622bf47b15a74089a06eed2d241f265a",
      indexName: "legend-finos-test",
      contextualSearch: true,
      searchPagePath: "search",
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      logo: {
        src: "img/legend.svg",
      },
      items: [
        {
          to: "docs/overview/legend-overview",
          label: "Docs",
          position: "right",
        },
        {
          to: "releases",
          label: "Releases",
          position: "right",
        },
      ],
    },

    footer: {
      links: [
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              to: "https://twitter.com/finosfoundation",
            },
            {
              label: "Privacy Policy",
              to: "https://www.finos.org/privacy-policy",
            },
          ],
        },
      ],
      logo: {
        alt: "FINOS",
        src: "https://legend.finos.org/img/finos_wordmark.svg",
        href: "https://www.finos.org",
      },
    },
  },
};
