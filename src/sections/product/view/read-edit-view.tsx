'use client';

import type { IReadItem } from 'src/types/read';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ReadNewEditForm } from '../read-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  read?: IReadItem;
};

export function ReadEditView({ read }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Read', href: paths.dashboard.read.root },
          { name: read?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ReadNewEditForm currentRead={read} />
    </DashboardContent>
  );
}
