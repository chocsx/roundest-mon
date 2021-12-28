import "tailwindcss/tailwind.css";
import "../styles/global.css";
import type { AppProps } from 'next/app';

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

import { withTRPC } from '@trpc/next';
import { AppType } from 'next/dist/shared/lib/utils';
import type { AppRouter } from '@/backend/router';

export default withTRPC<AppRouter>({
  config({ ctx }) {

    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : 'http://localhost:3000/api/trpc';

    return {
      url,
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },

  ssr: false,
})(MyApp);