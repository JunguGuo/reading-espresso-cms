'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ReadNewEditForm } from '../read-new-edit-form';

// ----------------------------------------------------------------------

export function ReadCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new read"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Read', href: paths.dashboard.read.root },
          { name: 'New Read' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ReadNewEditForm />
    </DashboardContent>
  );
}
