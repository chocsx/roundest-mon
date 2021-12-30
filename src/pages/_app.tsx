import "tailwindcss/tailwind.css";
import "../styles/global.css";
import type { AppProps } from 'next/app';

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

import { withTRPC } from '@trpc/next';
import { AppType } from 'next/dist/shared/lib/utils';
import type { AppRouter } from '@/backend/router';


function getBaseUrl() {
  if (process.browser) return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `https://localhost:${process.env.PORT ?? 3000}`;
}
export default withTRPC<AppRouter>({
  config({ ctx }) {

    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },

  ssr: false,
})(MyApp);