import type { IReadTableFilters } from 'src/types/read';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  filters: UseSetStateReturn<IReadTableFilters>;
  options: {
    regions: {
      value: string;
      label: string;
    }[];
    curators: {
      value: string;
      label: string;
    }[];
  };
};

export function ReadTableToolbar({ filters, options }: Props) {
  const popover = usePopover();

  const local = useSetState<IReadTableFilters>({
    region: filters.state.region,
    curator: filters.state.curator,
  });

  const handleChangeRegion = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;

      local.setState({ region: typeof value === 'string' ? value.split(',') : value });
    },
    [local]
  );

  const handleChangeCurator = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;

      local.setState({ curator: typeof value === 'string' ? value.split(',') : value });
    },
    [local]
  );

  const handleFilterRegion = useCallback(() => {
    filters.setState({ region: local.state.region });
  }, [filters, local.state.region]);

  const handleFilterCurator = useCallback(() => {
    filters.setState({ curator: local.state.curator });
  }, [filters, local.state.curator]);

  return (
    <>
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="product-filter-stock-select-label">Stock</InputLabel>

        <Select
          multiple
          value={local.state.region}
          onChange={handleChangeRegion}
          onClose={handleFilterRegion}
          input={<OutlinedInput label="Region" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'product-filter-stock-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.regions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={local.state.region.includes(option.value)}
              />
              {option.label}
            </MenuItem>
          ))}
          <MenuItem
            onClick={handleFilterRegion}
            sx={{
              justifyContent: 'center',
              fontWeight: (theme) => theme.typography.button,
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            }}
          >
            Apply
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="product-filter-curator-select-label">Curator</InputLabel>
        <Select
          multiple
          value={local.state.curator}
          onChange={handleChangeCurator}
          onClose={handleFilterCurator}
          input={<OutlinedInput label="Curator" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'product-filter-curator-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.curators.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={local.state.curator.includes(option.value)}
              />
              {option.label}
            </MenuItem>
          ))}

          <MenuItem
            disableGutters
            disableTouchRipple
            onClick={handleFilterCurator}
            sx={{
              justifyContent: 'center',
              fontWeight: (theme) => theme.typography.button,
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            }}
          >
            Apply
          </MenuItem>
        </Select>
      </FormControl>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
