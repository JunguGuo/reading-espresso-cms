import { CONFIG } from 'src/config-global';

import { ReadCreateView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ReadCreateView />;
}
