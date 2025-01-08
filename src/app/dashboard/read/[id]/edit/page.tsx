import axios from 'axios';

import { endpoints, axiosInstance2 } from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { ReadEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Product edit | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const { read } = await getRead(id);

  return <ReadEditView read={read} />;
}

// ----------------------------------------------------------------------

async function getRead(id: string) {
  const URL = id ? `${endpoints.read.details}${id}` : '';

  const res = await axiosInstance2.get(URL);

  return res.data.data;
}

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    const res = await axios.get(endpoints.product.list);

    return res.data.products.map((product: { id: string }) => ({ id: product.id }));
  }
  return [];
}
