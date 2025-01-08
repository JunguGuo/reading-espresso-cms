import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';

import { fTime, fDate } from 'src/utils/format-time';

import { maxLine } from 'src/theme/styles';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellCurator({ params }: ParamsProps) {
  return params.row.curator;
}

export function RenderCellContent({ params }: ParamsProps) {
  return (
    <Box component="div" sx={{ ...maxLine({ line: 2 }) }}>
      {params.row.content}
    </Box>
  );
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Label variant="soft" color={(params.row.publish === 'published' && 'info') || 'default'}>
      {params.row.publish}
    </Label>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.createdAt)}</Box>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box>
    </Stack>
  );
}

export function RenderCellRegion({ params }: ParamsProps) {
  return params.row.region;
}

export function RenderCellTitle({
  params,
  onViewRow,
}: ParamsProps & {
  onViewRow: () => void;
}) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.title}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.author}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
