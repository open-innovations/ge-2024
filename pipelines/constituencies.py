import os
import pandas as pd

def read_file(path, **kwargs):
    if kwargs:
        # Unpack the keyword arguments
        sheet_name, header = kwargs['sheet_name'], kwargs['header']

        # Read a given sheet in the excel file
        data = pd.read_excel(path, sheet_name=sheet_name, header=header)
    else:
        data = pd.read_excel(path)

    return data

def get_variable(data, col_name, var_name):
    if type(var_name) == list:
        l = len(var_name)
        if l == 0:
            print('No variable names provided. You gave var names:', var_name)
            raise ValueError
        else:
            for v in var_name:
                assert type(v) == str, f'variable {v} is not a string'
            data = data.loc[data[col_name].isin(var_name)]
    elif type(var_name) == str:
        data = data.loc[data[col_name] == var_name]

    return data

geo_codes = pd.read_csv('data/Westminster_Parliamentary_Constituencies_(Future)_Names_and_Codes_in_the_United_Kingdom_v2.csv', usecols=['PCON24CD', 'PCON24NM'])

def write_csv(data, path):
    data.to_csv(path)
    return 

def write_json(data, path):
    data.to_json(path, orient='index', indent=2)
    return 

def get_data(sheet_name, var_name, drop_cols, value_type=int, pct=None):
    # Set params
    path = 'data/Demographic-data-for-new-parliamentary-constituencies-May-2024.xlsx'
    kwargs = {'sheet_name': sheet_name, 'header': 2}

    # Read the file and cut the data 
    data = read_file(path, **kwargs).pipe(get_variable, 'Topic', var_name)
    print(f"Got the data for the variable(s):{var_name}, for the sheet: {sheet_name}\n")

    # Drop unused columns and rename to merge with constituency codes
    data.drop(columns=drop_cols, inplace=True)
    data.rename(columns={'New constituency name': 'PCON24NM', 'Constituency value': var_name}, inplace=True)

    # Convert the data types to integers
    data[var_name] = data[var_name].astype(value_type)

    # Get a list of unique variable names, and how many there are.
    v_names = list(data['Variable'].unique())
    v_num = len(v_names)

    if v_num > 1:
            # If there are multiple variables for a given topic, we want to pivot the data so that each of of these has its own column.
            print(f'More than one variable type: {v_names}. Pivoting the data\n')
            data = data.pivot(index='PCON24NM', columns='Variable', values=var_name)

    if v_num == 1:
        # If there is only one variable, we can drop the variable column as we don't need it.
        print(f'Only one variable type: {v_names}. Dropping the variable column\n')
        data.drop(columns='Variable', inplace=True)

    # Merge the geo codes and data, and set the index to the geo code.
    data = data.merge(geo_codes, on='PCON24NM', how='inner').set_index('PCON24CD', drop=True)

    if pct:
        # If the data is a pct, make it out of 100 and round to 1dp.
        data[v_names] = data[v_names].mul(100).round(1)

    # Drop PCON24NM column
    data.drop(columns='PCON24NM', inplace=True)

    return data

def concatenate_nations_data(dataframes):
    assert type(dataframes) == list, 'Argument given is not a list. Frames must be in a list to concatenate'
    return pd.concat(dataframes)

def my_func(data, dir, index_rename):
    for index, row in data.iterrows():
        transposed_row = row.to_frame()
        transposed_row.index.rename(index_rename, inplace=True)
        f_name = os.path.join(dir, f'{index}.csv')
        transposed_row.to_csv(f_name)

if __name__ == "__main__":
    
    england_wales_population = get_data('EW_data', 'Population', ['Topic', 'England & Wales value'])
    northern_ireland_population = get_data('NI_data', 'Population', ['Topic', 'Northern Ireland value'])
    uk_population = concatenate_nations_data([england_wales_population, northern_ireland_population])
    

    ew_age = get_data('EW_data', 'Age', ['Topic', 'England & Wales value'], value_type=float, pct=True)
    ni_age = get_data('NI_data', 'Age', ['Topic', 'Northern Ireland value'], value_type=float, pct=True)
    uk_age = concatenate_nations_data([ew_age, ni_age])
    # age_copy = uk_age.copy()
    # age_copy = age_copy.transpose()
    # age_copy.index.rename('age_band', inplace=True)
    # write_csv(uk_age, 'src/_data/age.csv')
    my_func(uk_age, dir='src/_data/age/', index_rename='age_band')
    

    ew_housing_tenure = get_data('EW_data', 'Housing tenure', ['Topic', 'England & Wales value'], value_type=float, pct=True)
    ni_housing_tenure = get_data('NI_data', 'Housing tenure', ['Topic', 'Northern Ireland value'], value_type=float, pct=True)
    uk_housing_tenure = concatenate_nations_data([ew_housing_tenure, ni_housing_tenure])
    # housing_copy = uk_housing_tenure.copy()
    # housing_copy = housing_copy.transpose()
    # housing_copy.index.rename('tenure_type', inplace=True)
    # write_csv(uk_housing_tenure, 'src/_data/housing_tenure.csv')
    my_func(uk_housing_tenure, dir='src/_data/housing_tenure', index_rename='tenure_type')

    ew_households = get_data('EW_data', 'Households', ['Topic', 'England & Wales value'], value_type=int)
    ni_households = get_data('NI_data', 'Households', ['Topic', 'Northern Ireland value'], value_type=int)
    uk_households = concatenate_nations_data([ew_households, ni_households])

    constituency_drilldown = uk_age.join([uk_households, uk_population, uk_housing_tenure])
    constituency_drilldown = constituency_drilldown.merge(geo_codes, on='PCON24CD')
    constituency_drilldown.set_index('PCON24CD', inplace=True)
    write_json(constituency_drilldown, 'src/_data/drilldown.json')