
import { TextField, Autocomplete } from '@mui/material';

export default function Autocomplete({ options, addTag, label }) {


    return (
        <Autocomplete
            sx={{ width: 3 / 5 }}
            freeSolo
            size='small'
            // value={tagSearch}
            onChange={(event, newValue) => {
                addTag(newValue)
            }}
            disableClearable
            options={options}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    InputProps={{
                        ...params.InputProps,
                        type: 'search',
                    }}
                />
            )}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
        />
    )
}