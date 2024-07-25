'use client';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IReadItem, IReadTableFilters } from 'src/types/read';
import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { useGetReads } from 'src/actions/read';
import { READ_REGION_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ReadTableToolbar } from '../read-table-toolbar';
import { ReadTableFiltersResult } from '../read-table-filters-result';
import {
  RenderCellTitle,
  RenderCellRegion,
  RenderCellContent,
  RenderCellCurator,
  RenderCellPublish,
  RenderCellCreatedAt,
} from '../read-table-row';

// ----------------------------------------------------------------------

const CURATOR_OPTIONS = [
  { value: 'Jungu Guo', label: 'Jungu' },
  { value: 'Raymond Rozman', label: 'Raymond' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function ReadListView() {
  const confirmRows = useBoolean();

  const router = useRouter();

  const { reads, readsLoading } = useGetReads();
  // const [readsLoading] = useState(false);
  // const [reads] = useState<IReadItem[]>([
  //   {
  //     id: '65b8bb3669aba4c12d14f8f3',
  //     title: 'The Epic of Gilgamesh',
  //     author: 'Unknown',
  //     content:
  //       "He who saw the Deep, the country's foundation,\n[Who] knew..., was wise in all matters!\n[Gilgamesh, who] saw the Deep, the country's foundation,\n[Who] knew..., was wise in all matters!\nHe it is who [ ]\nof the land, the world's entirety,\n[ ] comprehended [ ], [ ]\n[ ] the reed, [ ] the woodland!\n[ ] the reed, [ ] the woodland!\n[ ] the path, [ ] the way,\n[ ] the journeys, [ ] distant ways!",
  //     topics: ['legacy', 'adventure'],
  //     genre: ['epic', 'mythology'],
  //     year: -2100,
  //     yearStr: '2100 – 1200 BCE',
  //     intro:
  //       'The Epic of Gilgamesh, one of the oldest known works of literature, is an epic poem from ancient Mesopotamia. It follows the adventures of the historical king Gilgamesh.',
  //     curator: 'Jungu Guo',
  //     comment:
  //       'This ancient epic not only explores themes of friendship, mortality, and the pursuit of immortality but also provides a window into early human civilization.',
  //     region: 'Sumerian',
  //     createdAt: '2024-01-30T08:14:04.848Z',
  //     __v: 0,
  //     age: 19,
  //   },
  //   {
  //     id: '65b302d49a165af3a5d632fd',
  //     title: 'Iliad',
  //     author: 'Homer',
  //     content:
  //       'Jove lifts the golden balances, that show \nThe fates of mortal men, and things below: \nHere each contending hero’s lot he tries, \nAnd weighs, with equal hand, their destinies. \nLow sinks the scale surcharged with Hector’s fate; \nHeavy with death it sinks, and hell receives the weight. \n  \nThen Phœbus left him. Fierce Minerva flies \nTo stern Pelides, and triumphing, cries: \n“O loved of Jove! this day our labours cease, \nAnd conquest blazes with full beams on Greece. \nGreat Hector falls; that Hector famed so far, \nDrunk with renown, insatiable of war, \nFalls by thy hand, and mine! nor force, nor flight, \nShall more avail him, nor his god of light. \nSee, where in vain he supplicates above, \nRoll’d at the feet of unrelenting Jove; \nRest here: myself will lead the Trojan on, \nAnd urge to meet the fate he cannot shun.” \n  \n... \n  \nThe silence Hector broke: \nHis dreadful plumage nodded as he spoke: \n  \n“Enough, O son of Peleus! Troy has view’d \nHer walls thrice circled, and her chief pursued. \nBut now some god within me bids me try \nThine, or my fate: I kill thee, or I die. \nYet on the verge of battle let us stay, \nAnd for a moment’s space suspend the day; \nLet Heaven’s high powers be call’d to arbitrate \nThe just conditions of this stern debate, \n(Eternal witnesses of all below, \nAnd faithful guardians of the treasured vow!) \nTo them I swear; if, victor in the strife, \nJove by these hands shall shed thy noble life, \nNo vile dishonour shall thy corse pursue; \nStripp’d of its arms alone (the conqueror’s due) \nThe rest to Greece uninjured I’ll restore: \nNow plight thy mutual oath, I ask no more.” \n  \n“Talk not of oaths (the dreadful chief replies, \nWhile anger flash’d from his disdainful eyes), \nDetested as thou art, and ought to be, \nNor oath nor pact Achilles plights with thee: \nSuch pacts as lambs and rabid wolves combine, \nSuch leagues as men and furious lions join, \nTo such I call the gods! one constant state \nOf lasting rancour and eternal hate: \nNo thought but rage, and never-ceasing strife, \nTill death extinguish rage, and thought, and life. \nRouse then thy forces this important hour, \nCollect thy soul, and call forth all thy power. \nNo further subterfuge, no further chance; \n’Tis Pallas, Pallas gives thee to my lance. \nEach Grecian ghost, by thee deprived of breath, \nNow hovers round, and calls thee to thy death.” \n  \nHe spoke, and launch’d his javelin at the foe; \nBut Hector shunn’d the meditated blow: \nHe stoop’d, while o’er his head the flying spear \nSang innocent, and spent its force in air. \nMinerva watch’d it falling on the land, \nThen drew, and gave to great Achilles’ hand, \nUnseen of Hector, who, elate with joy, \nNow shakes his lance, and braves the dread of Troy. \n  \n“The life you boasted to that javelin given, \nPrince! you have miss’d. My fate depends on Heaven, \nTo thee, presumptuous as thou art, unknown, \nOr what must prove my fortune, or thy own. \nBoasting is but an art, our fears to blind, \nAnd with false terrors sink another’s mind. \nBut know, whatever fate I am to try, \nBy no dishonest wound shall Hector die. \nI shall not fall a fugitive at least, \nMy soul shall bravely issue from my breast. \nBut first, try thou my arm; and may this dart \nEnd all my country’s woes, deep buried in thy heart.” \n  \nThe weapon flew, its course unerring held, \nUnerring, but the heavenly shield repell’d \nThe mortal dart; resulting with a bound \nFrom off the ringing orb, it struck the ground. \nHector beheld his javelin fall in vain, \nNor other lance, nor other hope remain; \nHe calls Deiphobus, demands a spear— \nIn vain, for no Deiphobus was there. \nAll comfortless he stands: then, with a sigh; \n“’Tis so—Heaven wills it, and my hour is nigh! \nI deem’d Deiphobus had heard my call, \nBut he secure lies guarded in the wall. \nA god deceived me; Pallas, ’twas thy deed, \nDeath and black fate approach! ’tis I must bleed. \nNo refuge now, no succour from above, \nGreat Jove deserts me, and the son of Jove, \nPropitious once, and kind! Then welcome fate! \n’Tis true I perish, yet I perish great: \nYet in a mighty deed I shall expire, \nLet future ages hear it, and admire!” ',
  //     topics: ['heroism', 'fate'],
  //     genre: ['poetry', 'classic'],
  //     year: 1877,
  //     intro:
  //       'The Iliad, an ancient Greek epic poem, delves into the final days of the Trojan War, focusing on the conflict between King Agamemnon and the warrior Achilles.',
  //     curator: 'Raymond Rozman',
  //     comment:
  //       'In this excerpt from the "Iliad," Homer juxtaposes divine intervention and human courage. The gods manipulate fate, as seen in Jove\'s balancing act, yet Hector\'s defiance against Achilles underlines the enduring human spirit. This blend of celestial and mortal influence highlights the complex interplay between predetermined destiny and personal valor.',
  //     region: 'Greek',
  //     createdAt: '2024-01-26T00:50:23.623Z',
  //     __v: 0,
  //     yearStr: 'ca. 900 BCE',
  //     age: 19,
  //   },
  // ]);

  const filters = useSetState<IReadTableFilters>({ region: [], curator: [] });

  const [tableData, setTableData] = useState<IReadItem[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (reads.length) {
      console.log('Setting table data with reads');
      setTableData(reads);
    }
  }, [reads]);

  const canReset = filters.state.region.length > 0 || filters.state.curator.length > 0;

  const dataFiltered = applyFilter({ inputData: tableData, filters: filters.state });
  // const dataFiltered = reads;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state, selectedRowIds]
  );

  const columns: GridColDef[] = [
    { field: 'category', headerName: 'Category', filterable: false },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        <RenderCellTitle params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },
    {
      field: 'content',
      headerName: 'Content',
      width: 160,
      type: 'singleSelect',
      renderCell: (params) => <RenderCellContent params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Create at',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'region',
      headerName: 'Region',
      width: 160,
      type: 'singleSelect',
      valueOptions: READ_REGION_OPTIONS,
      renderCell: (params) => <RenderCellRegion params={params} />,
    },
    {
      field: 'curator',
      headerName: 'Curator',
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellCurator params={params} />,
    },
    {
      field: 'publish',
      headerName: 'Publish',
      width: 110,
      type: 'singleSelect',
      editable: true,
      valueOptions: CURATOR_OPTIONS,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          onClick={() => handleViewRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row.id);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Product', href: paths.dashboard.product.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.read.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Read
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={readsLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback as GridSlots['toolbar'],
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              panel: { anchorEl: filterButtonEl },
              toolbar: { setFilterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

interface CustomToolbarProps {
  canReset: boolean;
  filteredResults: number;
  selectedRowIds: GridRowSelectionModel;
  onOpenConfirmDeleteRows: () => void;
  filters: UseSetStateReturn<IReadTableFilters>;
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}: CustomToolbarProps) {
  return (
    <>
      <GridToolbarContainer>
        <ReadTableToolbar
          filters={filters}
          options={{ regions: READ_REGION_OPTIONS, curators: CURATOR_OPTIONS }}
        />

        <GridToolbarQuickFilter />

        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              Delete ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Stack>
      </GridToolbarContainer>

      {canReset && (
        <ReadTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IReadItem[];
  filters: IReadTableFilters;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  const { region, curator } = filters;

  if (region.length) {
    inputData = inputData.filter((read) => region.includes(read.region));
  }

  if (curator.length) {
    inputData = inputData.filter((read) => curator.includes(read.curator));
  }

  return inputData;
}
