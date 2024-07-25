import type { IReadItem } from 'src/types/read';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { _tags, READ_CURATOR_OPTIONS } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewReadSchemaType = zod.infer<typeof NewReadSchema>;

export const NewReadSchema = zod.object({
  title: zod.string().min(1, { message: 'title is required!' }),
  // description: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  // images: schemaHelper.files({ message: { required_error: 'Images is required!' } }),
  yearStr: zod.string().min(1, { message: 'Year is required!' }),
  // sku: zod.string().min(1, { message: 'Read sku is required!' }),
  // quantity: zod.number().min(1, { message: 'Quantity is required!' }),
  // colors: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  // sizes: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  topics: zod.string().array().min(2, { message: 'Must have at least 2 topics!' }),
  genre: zod.string().array().min(1, { message: 'Must have at least 1 genre!' }),
  // gender: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  // price: zod.number().min(1, { message: 'Price should not be $0.00' }),
  // Not required
  // category: zod.string(),
  // priceSale: zod.number(),
  // subDescription: zod.string(),
  // taxes: zod.number(),
  // saleLabel: zod.object({ enabled: zod.boolean(), content: zod.string() }),
  // newLabel: zod.object({ enabled: zod.boolean(), content: zod.string() }),
});

// ----------------------------------------------------------------------

type Props = {
  currentRead?: IReadItem;
};

export function ReadNewEditForm({ currentRead }: Props) {
  const router = useRouter();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const defaultValues = useMemo(
    () => ({
      title: currentRead?.title || '',
      // description: currentRead?.description || '',
      author: currentRead?.author || '',
      // images: currentRead?.images || [],
      //
      yearStr: currentRead?.yearStr || '',
      // sku: currentRead?.sku || '',
      // price: currentRead?.price || 0,
      // quantity: currentRead?.quantity || 0,
      // priceSale: currentRead?.priceSale || 0,
      topics: currentRead?.topics || [],
      genres: currentRead?.genre || [],
      // taxes: currentRead?.taxes || 0,
      // gender: currentRead?.gender || [],
      // category: currentRead?.category || PRODUCT_CATEGORY_GROUP_OPTIONS[0].classify[1],
      // colors: currentRead?.colors || [],
      // sizes: currentRead?.sizes || [],
      // newLabel: currentRead?.newLabel || { enabled: false, content: '' },
      // saleLabel: currentRead?.saleLabel || { enabled: false, content: '' },
    }),
    [currentRead]
  );

  const methods = useForm<NewReadSchemaType>({
    resolver: zodResolver(NewReadSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentRead) {
      reset(defaultValues);
    }
  }, [currentRead, defaultValues, reset]);

  // useEffect(() => {
  //   if (includeTaxes) {
  //     setValue('taxes', 0);
  //   } else {
  //     setValue('taxes', currentRead?.taxes || 0);
  //   }
  // }, [currentRead?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentRead ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.read.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  // const handleRemoveFile = useCallback(
  //   (inputFile: File | string) => {
  //     const filtered = values.images && values.images?.filter((file) => file !== inputFile);
  //     setValue('images', filtered);
  //   },
  //   [setValue, values.images]
  // );

  // const handleRemoveAllFiles = useCallback(() => {
  //   setValue('images', [], { shouldValidate: true });
  // }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Title, short description, image..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="title" label="Title" />

        <Field.Text name="author" label="Author" />

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          <Field.Text name="yearStr" label="Year" />

          <Field.Text name="region" label="Region" />

          <Field.Select native name="curator" label="Curator" InputLabelProps={{ shrink: true }}>
            {READ_CURATOR_OPTIONS.map((category) => (
              <option key={category.label} value={category.value}>
                {category.value}
              </option>
            ))}
          </Field.Select>
        </Box>

        <Field.Text name="intro" label="Introduction" multiline rows={3} />

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Content</Typography>
          <Field.Editor name="content" sx={{ maxHeight: 480 }} />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">Curator Comment</Typography>
          <Field.Text name="comment" multiline rows={4} />
        </Stack>

        {/* <Stack spacing={1.5}>
          <Typography variant="subtitle2">Images</Typography>
          <Field.Upload
            multiple
            thumbnail
            name="images"
            maxSize={3145728}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onUpload={() => console.info('ON UPLOAD')}
          />
        </Stack> */}
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Properties"
        subheader="Additional functions and attributes..."
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography variant="subtitle2">Tags</Typography>
        <Field.Autocomplete
          name="topics"
          label="Topics"
          placeholder="+ Topics"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_tags.map((option) => option)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />

        <Field.Autocomplete
          name="genre"
          label="Genre"
          placeholder="+ Genre"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_tags.map((option) => option)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />

        <Stack spacing={1}>
          <Typography variant="subtitle2">Age Group</Typography>
          <Field.Select native name="curator" InputLabelProps={{ shrink: true }}>
            {READ_CURATOR_OPTIONS.map((category) => (
              <option key={category.label} value={category.value}>
                {category.value}
              </option>
            ))}
          </Field.Select>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Stack direction="row" alignItems="center" spacing={3}>
          <Field.Switch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
          <Field.Text
            name="saleLabel.content"
            label="Sale label"
            fullWidth
            disabled={!values.saleLabel.enabled}
          />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={3}>
          <Field.Switch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
          <Field.Text
            name="newLabel.content"
            label="New label"
            fullWidth
            disabled={!values.newLabel.enabled}
          />
        </Stack> */}
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Publish"
        sx={{ pl: 3, flexGrow: 1 }}
      />

      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentRead ? 'Create read' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Stack>
    </Form>
  );
}
