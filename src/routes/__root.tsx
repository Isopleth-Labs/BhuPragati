import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

const SITE_URL = import.meta.env.PROD
	? "https://<org>.github.io/bhupragati"
	: "http://localhost:3000";

SITE_URL;

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "BhuPragati",
			},
			{
				name: "description",
				content: "Infrastructure intelligence platform for a better Bharat",
			},

			// Open Graph (Facebook / LinkedIn / Discord)
			{
				property: "og:title",
				content: "BhuPragati",
			},
			{
				property: "og:description",
				content: "Explore infrastructure and development data across India",
			},
			{
				property: "og:image",
				content: `${SITE_URL}/og-image.png`,
			},
			{
				property: "og:url",
				content: `${SITE_URL}`,
			},
			{
				property: "og:type",
				content: "website",
			},

			// Twitter / X cards
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "BhuPragati",
			},
			{
				name: "twitter:description",
				content: "Explore infrastructure and development data across India",
			},
			{
				name: "twitter:image",
				content: `${SITE_URL}/og-image.png`,
			},
			{
				name: "twitter:url",
				content: `${SITE_URL}`,
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
