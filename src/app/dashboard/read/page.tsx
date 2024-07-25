import { CONFIG } from 'src/config-global';

import { ReadListView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Read list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ReadListView />;
}
