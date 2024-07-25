import type { IReadTableFilters } from 'src/types/read';
import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { sentenceCase } from 'src/utils/change-case';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = {
  totalResults: number;
  sx?: SxProps<Theme>;
  filters: UseSetStateReturn<IReadTableFilters>;
};

export function ReadTableFiltersResult({ filters, totalResults, sx }: Props) {
  const handleRemoveRegion = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.region.filter((item) => item !== inputValue);

      filters.setState({ region: newValue });
    },
    [filters]
  );

  const handleRemoveCurator = useCallback(
    (inputValue: string) => {
      const newValue = filters.state.curator.filter((item) => item !== inputValue);

      filters.setState({ curator: newValue });
    },
    [filters]
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock label="Region:" isShow={!!filters.state.region.length}>
        {filters.state.region.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={sentenceCase(item)}
            onDelete={() => handleRemoveRegion(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Curator:" isShow={!!filters.state.curator.length}>
        {filters.state.curator.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={sentenceCase(item)}
            onDelete={() => handleRemoveCurator(item)}
          />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
